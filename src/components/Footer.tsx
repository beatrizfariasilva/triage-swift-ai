import { Separator } from "@/components/ui/separator";
import { HelpCircle, FileText, Shield, Mail } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            <HelpCircle className="h-4 w-4" />
            <span>Ajuda e Suporte</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            <FileText className="h-4 w-4" />
            <span>Termos e Condições</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            <Shield className="h-4 w-4" />
            <span>Política de Privacidade</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            <Mail className="h-4 w-4" />
            <span>Contato</span>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} triageFlow - Sistema Interno de Triagem Hospitalar</p>
        </div>
      </div>
    </footer>
  );
};
