import FileUploadComponent from './components/file-upload';
import ChatComponent from './components/chat';
import { ThemeToggle } from './components/theme-toggle';

export default function Home() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header with theme toggle */}
      <header className="border-b border-border p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">PDF RAG Chat</h1>
        <ThemeToggle />
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
        {/* Sidebar for file upload */}
        <aside className="w-full sm:w-[30%] p-4 border-b sm:border-b-0 sm:border-r border-border flex flex-col justify-center overflow-y-auto">
          <FileUploadComponent />
        </aside>

        {/* Main chat area */}
        <main className="w-full sm:w-[70%] flex-1 overflow-hidden">
          <ChatComponent />
        </main>
      </div>
    </div>
  );
}
