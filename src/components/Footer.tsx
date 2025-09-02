import React from "react";

const Footer: React.FC = () => (
  <footer className="w-full bg-muted py-6 mt-12 border-t border-border">
    <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
      <div>
        &copy; {new Date().getFullYear()} Desa Dermolo. All rights reserved.
      </div>
      <div className="flex items-center gap-2">
        <span>Made with</span>
        <span className="text-red-500">♥</span>
        <span>by <a href="https://bettadevindonesia.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">BettaDev Indonesia</a></span>
      </div>
      <div>
        <a href="/about" className="underline hover:text-primary">About</a> | <a href="/contact" className="underline hover:text-primary">Contact</a>
      </div>
    </div>
  </footer>
);

export default Footer;
