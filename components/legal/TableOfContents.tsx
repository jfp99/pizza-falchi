'use client';

import React from 'react';
import { List } from 'lucide-react';

interface TocItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  items: TocItem[];
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ items }) => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <nav className="bg-cream/50 dark:bg-gray-700/50 rounded-xl p-6 mb-8 border border-primary-red/20 dark:border-primary-red-light/20">
      <div className="flex items-center mb-4">
        <List className="w-5 h-5 text-primary-red dark:text-primary-red-light mr-2" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Sommaire
        </h2>
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className={`${item.level === 2 ? 'ml-0' : 'ml-6'}`}
          >
            <button
              onClick={() => scrollToSection(item.id)}
              className="text-left text-gray-700 dark:text-gray-300 hover:text-primary-red dark:hover:text-primary-red-light transition-colors underline-offset-2 hover:underline"
            >
              {item.title}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TableOfContents;
