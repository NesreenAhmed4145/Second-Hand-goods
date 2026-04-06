import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit ,ChangeDetectorRef} from '@angular/core';
import { Subscription } from 'rxjs';
import { ChatService } from '../services/chat';

@Component({
  selector: 'app-chat',
  standalone: false,
  templateUrl: './chat.html',
  styleUrls: ['./chat.css']
})
export class Chat implements OnInit, OnDestroy, AfterViewInit {
  messages: any[] = [];
  newMessage: string = '';
  user: string = 'Menna'; 
  sending = false;
  private sub: Subscription | null = null;

  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  constructor(
    private chatService: ChatService,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.sub = this.chatService.getMessages().subscribe({
      next: (msgs) => {
        this.messages = msgs.map(m => {
          let dateVal = new Date(); 
          try {
            if (m.timestamp && typeof m.timestamp.toDate === 'function') {
              dateVal = m.timestamp.toDate();
            } else if (m.timestamp) {
              dateVal = new Date(m.timestamp);
            }
          } catch (e) { }
          return { ...m, createdAt: dateVal };
        });

        this.messages.sort((a, b) => {
          const timeA = a.createdAt ? a.createdAt.getTime() : 0;
          const timeB = b.createdAt ? b.createdAt.getTime() : 0;
          return timeA - timeB;
        });
        
        // تنبيه للشاشة إن فيه رسايل جديدة
        this.cdr.detectChanges(); 
        this.scrollToBottom();
      },
      error: (err) => console.error(err)
    });
  }

  ngAfterViewInit() { this.scrollToBottom(); }

  async send() {
    if (!this.newMessage.trim()) return;
    
    this.sending = true; 

    try {
      await this.chatService.sendMessage({
        user: this.user,
        content: this.newMessage.trim(),
        timestamp: new Date().toISOString() 
      });

      
      this.newMessage = ''; 

    } catch (err) { 
      console.error(err); 
    } finally {
      this.sending = false; 
      

      this.cdr.detectChanges(); 
      
      this.scrollToBottom();
    }
  }

  scrollToBottom() {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch(err) { }
  }

  ngOnDestroy() { if (this.sub) this.sub.unsubscribe(); }
}