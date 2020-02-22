import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { faWindowClose, faReply, faRetweet, faStar, faEllipsisH, faLock, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faWindowClose as faWindowCloseRegular } from "@fortawesome/free-regular-svg-icons";

import { MastodonWrapperService } from '../../../../services/mastodon-wrapper.service';
import { AccountInfo } from '../../../../states/accounts.state';
import { Status, Account, Results } from '../../../../services/models/mastodon.interfaces';
import { ToolsService, OpenThreadEvent } from '../../../../services/tools.service';
import { NotificationService } from '../../../../services/notification.service';
import { StatusWrapper } from '../../../../models/common.model';
import { StatusesStateService, StatusState } from '../../../../services/statuses-state.service';

@Component({
    selector: 'app-action-bar',
    templateUrl: './action-bar.component.html',
    styleUrls: ['./action-bar.component.scss']
})
export class ActionBarComponent implements OnInit, OnDestroy {
    faWindowClose = faWindowClose;
    faReply = faReply;
    faRetweet = faRetweet;
    faStar = faStar;
    faWindowCloseRegular = faWindowCloseRegular;
    faEllipsisH = faEllipsisH;
    faLock = faLock;
    faEnvelope = faEnvelope;

    @Input() statusWrapper: StatusWrapper;
    @Output() replyEvent = new EventEmitter();
    @Output() cwIsActiveEvent = new EventEmitter<boolean>();

    @Output() browseThreadEvent = new EventEmitter<OpenThreadEvent>();

    isFavorited: boolean;
    isBoosted: boolean;
    isDM: boolean;

    isBoostLocked: boolean;
    isLocked: boolean;

    favoriteIsLoading: boolean;
    boostIsLoading: boolean;

    isContentWarningActive: boolean = false;

    displayedStatus: Status;

    private isProviderSelected: boolean;
    private selectedAccounts: AccountInfo[];

    private favoriteStatePerAccountId: { [id: string]: boolean; } = {};
    private bootedStatePerAccountId: { [id: string]: boolean; } = {};

    private accounts$: Observable<AccountInfo[]>;
    private accountSub: Subscription;
    private statusStateSub: Subscription;

    constructor(
        private readonly store: Store,
        private readonly toolsService: ToolsService,
        private readonly statusStateService: StatusesStateService,
        private readonly mastodonService: MastodonWrapperService,
        private readonly notificationService: NotificationService) {

        this.accounts$ = this.store.select(state => state.registeredaccounts.accounts);
    }

    ngOnInit() {
        const status = this.statusWrapper.status;
        const account = this.statusWrapper.provider;

        if (status.reblog) {
            this.favoriteStatePerAccountId[account.id] = status.reblog.favourited;
            this.bootedStatePerAccountId[account.id] = status.reblog.reblogged;
            this.displayedStatus = status.reblog;
        } else {
            this.favoriteStatePerAccountId[account.id] = status.favourited;
            this.bootedStatePerAccountId[account.id] = status.reblogged;
            this.displayedStatus = status;
        }

        this.analyseMemoryStatus();

        if (this.displayedStatus.visibility === 'direct') {
            this.isDM = true;
        }

        this.accountSub = this.accounts$.subscribe((accounts: AccountInfo[]) => {
            this.checkStatus(accounts);
        });

        this.statusStateSub = this.statusStateService.stateNotification.subscribe((state: StatusState) => {
            if (state && state.statusId === this.displayedStatus.url) {
                this.favoriteStatePerAccountId[state.accountId] = state.isFavorited;
                this.bootedStatePerAccountId[state.accountId] = state.isRebloged;

                this.checkIfFavorited();
                this.checkIfBoosted();
            }
        });
    }

    ngOnDestroy(): void {
        this.accountSub.unsubscribe();
        this.statusStateSub.unsubscribe();
    }

    private analyseMemoryStatus() {
        let memoryStatusState = this.statusStateService.getStateForStatus(this.displayedStatus.url);
        if (!memoryStatusState) return;

        memoryStatusState.forEach((state: StatusState) => {
            this.favoriteStatePerAccountId[state.accountId] = state.isFavorited;
            this.bootedStatePerAccountId[state.accountId] = state.isRebloged;
        });
    }

    private checkStatus(accounts: AccountInfo[]): void {
        const status = this.statusWrapper.status;
        const provider = this.statusWrapper.provider;
        this.selectedAccounts = accounts.filter(x => x.isSelected);
        this.isProviderSelected = this.selectedAccounts.filter(x => x.id === provider.id).length > 0;

        if (status.visibility === 'direct' || status.visibility === 'private') {
            this.isBoostLocked = true;
        } else {
            this.isBoostLocked = false;
        }

        if ((status.visibility === 'direct' || status.visibility === 'private') && !this.isProviderSelected) {
            this.isLocked = true;
        } else {
            this.isLocked = false;
        }

        if (status.sensitive || status.spoiler_text) {
            this.isContentWarningActive = true;
        }

        this.checkIfFavorited();
        this.checkIfBoosted();
    }

    showContent(): boolean {
        this.isContentWarningActive = false;
        this.cwIsActiveEvent.next(false);
        return false;
    }

    hideContent(): boolean {
        this.isContentWarningActive = true;
        this.cwIsActiveEvent.next(true);
        return false;
    }

    reply(): boolean {
        this.replyEvent.emit();
        return false;
    }

    boost(): boolean {
        if (this.boostIsLoading) return;

        this.boostIsLoading = true;
        const account = this.toolsService.getSelectedAccounts()[0];
        const usableStatus = this.toolsService.getStatusUsableByAccount(account, this.statusWrapper);
        usableStatus
            .then((status: Status) => {
                if (this.isBoosted && status.reblogged) {
                    return this.mastodonService.unreblog(account, status);
                } else if (!this.isBoosted && !status.reblogged) {
                    return this.mastodonService.reblog(account, status);
                } else {
                    return Promise.resolve(status);
                }
            })
            .then((boostedStatus: Status) => {
                if (boostedStatus.pleroma) {
                    this.bootedStatePerAccountId[account.id] = boostedStatus.reblog !== null; //FIXME: when Pleroma will return the good status
                } else {
                    let reblogged = boostedStatus.reblogged; //FIXME: when pixelfed will return the good status
                    if (reblogged === null) {
                        reblogged = !this.bootedStatePerAccountId[account.id];
                    }
                    this.bootedStatePerAccountId[account.id] = reblogged;
                }

                this.checkIfBoosted();
            })
            .catch((err: HttpErrorResponse) => {
                this.notificationService.notifyHttpError(err, account);
            })
            .then(() => {
                this.statusStateService.statusReblogStatusChanged(this.displayedStatus.url, account.id, this.bootedStatePerAccountId[account.id]);
                this.boostIsLoading = false;
            });

        return false;
    }

    favorite(): boolean {
        if (this.favoriteIsLoading) return;

        this.favoriteIsLoading = true;
        const account = this.toolsService.getSelectedAccounts()[0];
        const usableStatus = this.toolsService.getStatusUsableByAccount(account, this.statusWrapper);
        usableStatus
            .then((status: Status) => {
                if (this.isFavorited && status.favourited) {
                    return this.mastodonService.unfavorite(account, status);
                } else if (!this.isFavorited && !status.favourited) {
                    return this.mastodonService.favorite(account, status);
                } else {
                    return Promise.resolve(status);
                }
            })
            .then((favoritedStatus: Status) => {
                let favourited = favoritedStatus.favourited; //FIXME: when pixelfed will return the good status
                if (favourited === null) {
                    favourited = !this.favoriteStatePerAccountId[account.id];
                }
                this.favoriteStatePerAccountId[account.id] = favourited;
                this.checkIfFavorited();
            })
            .catch((err: HttpErrorResponse) => {
                this.notificationService.notifyHttpError(err, account);
            })
            .then(() => {
                this.statusStateService.statusFavoriteStatusChanged(this.displayedStatus.url, account.id, this.favoriteStatePerAccountId[account.id]);
                this.favoriteIsLoading = false;
            });

        return false;
    }

    private checkIfBoosted() {
        const selectedAccount = <AccountInfo>this.selectedAccounts[0];
        if (selectedAccount) {
            this.isBoosted = this.bootedStatePerAccountId[selectedAccount.id];
        } else {
            this.isBoosted = false;
        }
    }

    private checkIfFavorited() {
        const selectedAccount = <AccountInfo>this.selectedAccounts[0];

        if (selectedAccount) {
            this.isFavorited = this.favoriteStatePerAccountId[selectedAccount.id];
        } else {
            this.isFavorited = false;
        }
    }

    browseThread(event: OpenThreadEvent) {
        this.browseThreadEvent.next(event);
    }
}
