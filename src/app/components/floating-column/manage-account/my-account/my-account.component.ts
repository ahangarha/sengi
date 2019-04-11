import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store, Select } from '@ngxs/store';
import { faCheckSquare } from "@fortawesome/free-regular-svg-icons";

import { NotificationService } from '../../../../services/notification.service';
import { StreamElement, StreamTypeEnum, AddStream, RemoveAllStreams } from '../../../../states/streams.state';
import { AccountWrapper } from '../../../../models/account.models';
import { RemoveAccount } from '../../../../states/accounts.state';
import { NavigationService } from '../../../../services/navigation.service';

@Component({
    selector: 'app-my-account',
    templateUrl: './my-account.component.html',
    styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements OnInit, OnDestroy {
   
    faCheckSquare = faCheckSquare;
    
    availableStreams: StreamWrapper[] = [];

    private _account: AccountWrapper;
    @Input('account')
    set account(acc: AccountWrapper) {
        this._account = acc;
        this.loadStreams(acc);
    }
    get account(): AccountWrapper {
        return this._account;
    }
    
    @Select(state => state.streamsstatemodel.streams) streamElements$: Observable<StreamElement[]>;
    private streamChangedSub: Subscription;

    constructor(
        private readonly store: Store,
        private readonly navigationService: NavigationService,
        private notificationService: NotificationService) { }

    ngOnInit() {
        this.streamChangedSub = this.streamElements$.subscribe((streams: StreamElement[]) => {
            this.loadStreams(this.account);
        });
    }

    ngOnDestroy(): void {
        if(this.streamChangedSub) { 
            this.streamChangedSub.unsubscribe();
        }
    }

    private loadStreams(account: AccountWrapper){
        const instance = account.info.instance;
        this.availableStreams.length = 0;
        this.availableStreams.push(new StreamWrapper(new StreamElement(StreamTypeEnum.global, 'Federated Timeline', account.info.id, null, null, instance)));
        this.availableStreams.push(new StreamWrapper(new StreamElement(StreamTypeEnum.local, 'Local Timeline', account.info.id, null, null, instance)));
        this.availableStreams.push(new StreamWrapper(new StreamElement(StreamTypeEnum.personnal, 'Home', account.info.id, null, null, instance)));

        const loadedStreams = <StreamElement[]>this.store.snapshot().streamsstatemodel.streams;
        this.availableStreams.forEach(s => {
            if(loadedStreams.find(x => x.id === s.id)){
                s.isAdded = true;
            } else {
                s.isAdded = false;
            }
        });
    }

    addStream(stream: StreamWrapper): boolean {
        if (stream && !stream.isAdded) {
            this.store.dispatch([new AddStream(stream)]).toPromise()
                .then(() => {
                    stream.isAdded = true;
                    //this.notificationService.notify(`stream added`, false);
                });            
        }
        return false;
    }

    removeAccount(): boolean {
        const accountId = this.account.info.id;
        this.store.dispatch([new RemoveAllStreams(accountId), new RemoveAccount(accountId)]);
        this.navigationService.closePanel();
        return false;
    }
}

class StreamWrapper extends StreamElement {
    constructor(stream: StreamElement) {
        super(stream.type, stream.name, stream.accountId, stream.tag, stream.list, stream.instance);        
    }

    isAdded: boolean;
}