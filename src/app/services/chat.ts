import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  // 1. بنعرف متغير يشيل "وصلة" الرسايل
  private messagesRef: AngularFirestoreCollection<any>;

  constructor(private firestore: AngularFirestore) {
    // 2. التعديل المهم جداً:
    // لازم نحدد مكان الكولكشن هنا جوه الـ Constructor مش في أي حتة تانية
    // عشان نتفادى إيرور NG0203
    this.messagesRef = this.firestore.collection('chats').doc('general-chat').collection('messages');
  }

  // دالة الإرسال (بنستخدم الوصلة اللي جهزناها فوق)
  sendMessage(data: any) {
    return this.messagesRef.add(data);
  }

  // دالة الاستقبال (بنستخدم الوصلة برضه)
  getMessages(): Observable<any[]> {
    // valueChanges بترجع Observable وده آمن نستخدمه هنا
    return this.messagesRef.valueChanges(); 
  }
}