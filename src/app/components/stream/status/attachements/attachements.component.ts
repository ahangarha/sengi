import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { faPlay, faPause, faExpand, faVolumeUp, faVolumeMute } from "@fortawesome/free-solid-svg-icons";

import { Attachment } from '../../../../services/models/mastodon.interfaces';
import { NavigationService } from '../../../../services/navigation.service';
import { OpenMediaEvent } from '../../../../models/common.model';

@Component({
    selector: 'app-attachements',
    templateUrl: './attachements.component.html',
    styleUrls: ['./attachements.component.scss']
})
export class AttachementsComponent implements OnInit {    
    imageAttachments: Attachment[] = [];
    videoAttachments: Attachment[] = [];
    audioAttachments: Attachment[] = [];

    private _attachments: Attachment[];
    // isImage: boolean;
    // isGifv: boolean;
    // isVideo: boolean;
    // isAudio: boolean;

    faPlay = faPlay;
    faPause = faPause;
    faExpand = faExpand;
    faVolumeUp = faVolumeUp;
    faVolumeMute = faVolumeMute;

    isPlaying: boolean = false;
    isMuted: boolean = false;

    audioType: string;

    @Input('attachments')
    set attachments(value: Attachment[]) {
        this._attachments = value;

        this.setAttachments(value);

        // if (this._attachments[0].type === 'image') {
        //     this.isImage = true;
        // } else if (this._attachments[0].type === 'gifv') {
        //     this.isGifv = true;
        // } else if (this._attachments[0].type === 'video') {
        //     this.isVideo = true;
        // } else if (this._attachments[0].type === 'audio') {
        //     this.isAudio = true;
        //     this.setAudioData(this._attachments[0]);
        // }
    }
    get attachments(): Attachment[] {
        return this._attachments;
    }

    @ViewChild('videoPlayer') videoplayer: ElementRef;

    constructor(private readonly navigationService: NavigationService) { }

    ngOnInit() {
    }

    private setAttachments(att: Attachment[]){
        att.forEach(a => {
            if(a.type === 'image' || a.type === 'gifv'){
                this.imageAttachments.push(a);
            } else if(a.type === 'video') {
                this.videoAttachments.push(a);                
            } else if(a.type === 'audio') {
                this.audioAttachments.push(a);
                this.setAudioData(a);
            }
        });
    }

    attachmentSelected(index: number): boolean {
        let openMediaEvent = new OpenMediaEvent(index, this.attachments, null);
        this.navigationService.openMedia(openMediaEvent);
        return false;
    }

    private getVideo(): HTMLVideoElement {
        return this.videoplayer.nativeElement;
    }

    onPlay(): boolean {
        if (!this.isPlaying) {
            this.getVideo().play();
        } else {
            this.getVideo().pause();
        }

        this.isPlaying = !this.isPlaying;
        return false;
    }

    onExpand(): boolean {
        if (!this.isMuted) {
            this.onMute();
        }

        if (this.isPlaying) {
            this.onPlay();
        }

        this.attachmentSelected(0);
        return false;
    }

    onMute(): boolean {        
        this.isMuted = !this.isMuted;
        this.getVideo().muted = this.isMuted;
        return false;
    }

    setAudioData(att: Attachment): any {
        if(att.meta && att.meta.audio_encode){
            this.audioType = `audio/${att.meta.audio_encode}`;
        } else if(att.pleroma && att.pleroma.mime_type){
            this.audioType = att.pleroma.mime_type;
        }
    }
}
