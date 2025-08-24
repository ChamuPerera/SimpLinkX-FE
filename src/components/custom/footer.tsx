import type { FC } from "react";

import { Brand } from "@/components/custom/brand";
import { Mail, Phone } from "lucide-react";

export const Footer: FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="gap-y-4 flex flex-col">
            <Brand />
            <p className="text-gray-400 text-sm">
              Sri Lanka's comprehensive digital healthcare platform, connecting
              patients, doctors, and hospitals nationwide.
            </p>
            <div className="flex gap-x-4">
              <div className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                <Phone className="h-4 w-4" />
              </div>
              <div className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                <Mail className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="gap-y-4 flex flex-col">
            <h4 className="text-lg font-semibold">Services</h4>
            <ul className="gap-y-2 flex flex-col text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Online Appointments
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Medicine Finder
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Hospital Directory
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Rajya Osusala Outlets Locations
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="gap-y-4 flex flex-col">
            <h4 className="text-lg font-semibold">Support</h4>
            <ul className="gap-y-2 flex flex-col text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="gap-y-4 flex flex-col">
            <h4 className="text-lg font-semibold">Contact</h4>
            <div className="gap-y-2 flex flex-col text-sm text-gray-400">
              <p>Emergency: 1990</p>
              <p>Support: +94 11 xxx xxxx</p>
              <p>Email: support@simplinkx.lk</p>
              <p>Colombo, Sri Lanka</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-400">
          <p>
            &copy; 2025 SimpLinkX. All rights reserved. | A Government of Sri
            Lanka Initiative
          </p>
        </div>
      </div>
    </footer>
  );
};
