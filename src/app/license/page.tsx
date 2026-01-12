import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { siteConfig } from "@/lib/config";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function LicensePage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="mb-8">
            <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>
          
          <div className="prose dark:prose-invert max-w-none">
            <h1>License</h1>
            <p className="lead">
              {siteConfig.name} is free and open-source software licensed under the <strong>GNU General Public License v3.0 (GPLv3)</strong>.
            </p>
            
            <div className="p-6 bg-muted rounded-lg border my-8">
              <h3 className="mt-0">GNU GENERAL PUBLIC LICENSE</h3>
              <p className="text-sm text-muted-foreground mb-4">Version 3, 29 June 2007</p>
              <p className="text-sm">
                Copyright © 2007 Free Software Foundation, Inc. &lt;https://fsf.org/&gt;
              </p>
              <p className="text-sm mt-4">
                Everyone is permitted to copy and distribute verbatim copies of this license document, but changing it is not allowed.
              </p>
            </div>

            <h2>Preamble</h2>
            <p>
              The GNU General Public License is a free, copyleft license for software and other kinds of works.
            </p>
            <p>
              The licenses for most software and other practical works are designed to take away your freedom to share and change the works. By contrast, the GNU General Public License is intended to guarantee your freedom to share and change all versions of a program--to make sure it remains free software for all its users. We, the Free Software Foundation, use the GNU General Public License for most of our software; it applies also to any other work released this way by its authors. You can apply it to your programs, too.
            </p>
            <p>
              When we speak of free software, we are referring to freedom, not price. Our General Public Licenses are designed to make sure that you have the freedom to distribute copies of free software (and charge for them if you wish), that you receive source code or can get it if you want it, that you can change the software or use pieces of it in new free programs, and that you know you can do these things.
            </p>
            
            <h3>Terms and Conditions</h3>
            <p>
              This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
            </p>
            
            <p>
              You should have received a copy of the GNU General Public License along with this program. If not, see <a href="https://www.gnu.org/licenses/" target="_blank" rel="noopener noreferrer">https://www.gnu.org/licenses/</a>.
            </p>

            <div className="mt-8">
              <h3>Qt6 Licensing</h3>
              <p>
                This application is built using the Qt6 framework. Qt is available under commercial and open-source licenses (GPL and LGPL). This application utilizes Qt under the LGPLv3/GPLv3 license terms.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
