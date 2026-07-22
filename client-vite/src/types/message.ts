export interface Message {
    type: 'success' | 'error' | 'warning' | 'info';
    text: string;
}