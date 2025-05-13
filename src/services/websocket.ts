import { io, Socket } from 'socket.io-client';
import { Note } from '../types';

class WebSocketService {
  private socket: Socket | null = null;
  private noteId: string | null = null;

  connect(noteId: string) {
    if (this.socket && this.noteId === noteId) return;

    this.socket = io(import.meta.env.VITE_WEBSOCKET_URL, {
      query: { noteId },
    });

    this.noteId = noteId;

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.noteId = null;
    }
  }

  onNoteUpdate(callback: (note: Partial<Note>) => void) {
    if (!this.socket) return;
    this.socket.on('note:update', callback);
  }

  emitNoteUpdate(noteUpdate: Partial<Note>) {
    if (!this.socket) return;
    this.socket.emit('note:update', noteUpdate);
  }
}

export const websocketService = new WebSocketService();