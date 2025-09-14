'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function WorkflowHeader({ blocks, showButtons = true, createdRepoName }) {
  const router = useRouter();
  const handlePublish = async () => {
    try {
      const configureCiCdUrl = process.env.NEXT_PUBLIC_CONFIGURE_CI_CD_URL;

      if (!configureCiCdUrl) {
        alert('Configure CI/CD API URL not configured. Please check your environment variables.');
        return;
      }

      if (!createdRepoName) {
        alert('Please create a repository first before configuring CI/CD.');
        return;
      }

      const payload = {
        repoName: createdRepoName
      };

      console.log('Configuring CI/CD with payload:', payload);

      const response = await fetch(configureCiCdUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        alert('CI/CD configured successfully!');
        console.log('Configure CI/CD result:', result);
      } else {
        alert(`Error configuring CI/CD: ${result.message || 'Unknown error'}`);
        console.error('Configure CI/CD error:', result);
      }
    } catch (error) {
      alert(`Network error: ${error.message}`);
      console.error('Configure CI/CD network error:', error);
    }
  };
  return (
    <div className="w-full h-16 bg-neutral-900 border-b border-zinc-800 flex items-center justify-between px-10">
      {/* Logo */}
      <div 
        className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => router.push('/')}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.0534668 1.96411C1.27163 0.339895 2.49312 -0.185474 4.50464 0.0559082C5.4907 0.866672 6.00673 1.38443 6.41187 2.59985C6.42443 3.3415 6.42586 4.08382 6.41187 4.82544H9.59155C9.55877 4.3861 9.52572 3.94606 9.49194 3.49341C9.49917 2.34749 9.56091 2.01012 10.2068 1.01001C11.4734 0.182838 12.5301 -0.119263 14.0417 0.0559082C15.0636 0.694586 15.4839 1.18451 15.8533 2.33423C15.9949 3.10451 16.0485 3.72959 15.95 4.50708C15.1574 5.5638 14.6561 5.99761 13.406 6.41431C12.6644 6.42687 11.922 6.4283 11.1804 6.41431V9.59399C11.6198 9.56121 12.0598 9.52816 12.5125 9.49438C13.6585 9.50161 13.9956 9.56419 14.9958 10.2102C15.8231 11.4769 16.1252 12.5333 15.95 14.0452C15.3114 15.0669 14.822 15.4863 13.6726 15.8557C12.9021 15.9974 12.2765 16.051 11.4988 15.9524C10.4422 15.16 10.0082 14.6593 9.59155 13.4094C9.57898 12.6677 9.57756 11.9255 9.59155 11.1838H6.41187C6.44465 11.6231 6.4777 12.0623 6.51147 12.5149C6.50425 13.6612 6.44175 13.9989 5.79565 14.9993C4.52907 15.8264 3.47248 16.1277 1.96069 15.9524C0.939007 15.3138 0.519515 14.8246 0.150146 13.675C0.00841106 12.9045 -0.0451541 12.2789 0.0534668 11.5012C0.845802 10.4448 1.34667 10.0106 2.59644 9.59399C3.33809 9.58142 4.08039 9.58 4.82202 9.59399V6.41431C4.38277 6.44709 3.94353 6.48014 3.49097 6.51392C2.34485 6.5067 2.00759 6.44487 1.00757 5.79907C0.185986 4.54102 -0.137187 3.46812 0.0534668 1.96411ZM4.82202 11.1838C3.4589 11.1324 2.80092 11.0472 1.64233 11.8196C1.49058 13.0032 1.59909 13.3436 2.27905 14.3635C3.16829 14.5003 3.66323 14.4833 4.44409 14.0256C4.93696 13.2215 4.93734 13.2212 4.82202 11.1838ZM12.4138 11.1243C11.9951 11.1445 11.5888 11.1642 11.1824 11.1838C11.1309 12.5468 11.046 13.2042 11.8181 14.3625C12.6129 14.4619 12.6131 14.4619 13.408 14.3625C14.0434 13.7271 14.0436 13.727 14.282 12.9524C14.3615 12.1377 14.3612 12.1376 13.7253 11.1838C13.5152 11.1522 13.3112 11.1218 13.1072 11.0911C12.7573 11.108 12.7568 11.1077 12.4138 11.1243ZM6.41187 9.59399H9.59155V6.41431H6.41187V9.59399ZM4.18628 1.64575C3.00262 1.494 2.66228 1.60153 1.64233 2.28149C1.49058 3.46515 1.59909 3.80549 2.27905 4.82544C2.48917 4.85708 2.69327 4.8875 2.89722 4.91821C3.13262 4.90682 3.36112 4.89607 3.5896 4.88501C4.00845 4.86474 4.41549 4.84511 4.82202 4.82544C4.87346 3.46229 4.95868 2.80435 4.18628 1.64575ZM13.7244 1.64575C12.5407 1.494 12.2004 1.60153 11.1804 2.28149C11.0873 2.89997 11.0873 2.90047 11.1804 4.82544C12.2533 4.86518 12.2538 4.86517 13.406 4.82544C14.0419 4.18958 14.0426 4.18926 14.281 3.41431C14.3605 2.59971 14.3602 2.5995 13.7244 1.64575Z" fill="#7C3BED"/>
        </svg>
        <div className="text-white text-lg font-light italic font-lexend">
          Glassbox
        </div>
      </div>
      
      {/* Right side buttons - only show if showButtons is true */}
      {showButtons && (
        <div className="flex items-center gap-3">
          {/* Publish Button */}
          <button
            onClick={handlePublish}
            className="w-28 h-9 bg-violet-600 rounded-md flex items-center gap-2 px-4 hover:bg-violet-700 transition-colors"
          >
            <svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 0V1.375H9.625V0H0ZM0 6.875H2.75V11H6.875V6.875H9.625L4.8125 2.0625L0 6.875Z" fill="white"/>
            </svg>
            <span className="text-white text-base font-medium">Publish</span>
          </button>
        </div>
      )}
    </div>
  );
}
