import "./globals.css";
import Navbar from "./components/navbar";
import Wrapper from "./components/Session";
import { AppProvider } from "./context";

export const metadata = {
  title: "SchoolTime - Face Recognition Attendance System",
  description: "Modern attendance tracking system powered by face recognition.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-gradient-to-b from-gray-900 to-gray-800 text-white overflow-x-hidden">
        <AppProvider>
          <div className="flex flex-col min-h-screen">
            <Wrapper>
              <Navbar />
              <main className="flex-grow">{children}</main>
              <footer className="bg-gray-900 py-4 text-center text-gray-400 text-sm">
                <div className="container mx-auto">
                  <p>&copy; {new Date().getFullYear()} SchoolTime. All rights reserved.</p>
                  <p className="mt-1">Face Recognition Attendance System</p>
                </div>
              </footer>
            </Wrapper>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
