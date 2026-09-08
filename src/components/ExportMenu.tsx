import React, { useState } from 'react';
import { useApp } from '../store';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';

interface ExportMenuProps {
  onClose: () => void;
}

export default function ExportMenu({ onClose }: ExportMenuProps) {
  const { currentNote, isRTL } = useApp();
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState('');

  if (!currentNote) return null;

  const getExportContent = () => {
    const title = currentNote.title;
    const date = new Date(currentNote.updatedAt).toLocaleDateString(isRTL ? 'fa-IR' : 'en-US');
    let content = currentNote.content;

    // Add checklist items
    if (currentNote.checklist && currentNote.checklist.length > 0) {
      const checklistText = currentNote.checklist
        .map(item => `${item.checked ? '✅' : '⬜'} ${item.text}`)
        .join('\n');
      content += '\n\n' + checklistText;
    }

    // Add voice recording info
    if (currentNote.voiceRecordings && currentNote.voiceRecordings.length > 0) {
      content += '\n\n' + (isRTL ? '🎤 ضبط‌های صوتی:' : '🎤 Voice Recordings:');
      currentNote.voiceRecordings.forEach((rec, i) => {
        const mins = Math.floor(rec.duration / 60);
        const secs = rec.duration % 60;
        content += `\n  ${i + 1}. ${mins}:${secs.toString().padStart(2, '0')}`;
      });
    }

    return { title, date, content };
  };

  const exportAsImage = async () => {
    setIsExporting(true);
    setExportStatus(isRTL ? 'در حال تبدیل به تصویر...' : 'Converting to image...');

    try {
      const { title, date, content } = getExportContent();

      // Create a temporary element for rendering
      const tempDiv = document.createElement('div');
      tempDiv.style.cssText = `
        position: fixed; top: -9999px; left: -9999px;
        width: 800px; padding: 60px; background: white;
        font-family: 'Vazirmatn', 'Calibri', sans-serif;
        direction: ${isRTL ? 'rtl' : 'ltr'};
      `;
      tempDiv.innerHTML = `
        <div style="border-bottom: 3px solid #7c3aed; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="font-size: 28px; color: #1a1a2e; margin: 0 0 8px 0;">${title}</h1>
          <p style="color: #6b7280; font-size: 14px; margin: 0;">${date}</p>
        </div>
        <div style="font-size: 16px; line-height: 1.8; color: #374151; white-space: pre-wrap;">${content}</div>
        ${currentNote.tags.length > 0 ? `
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; display: flex; gap: 8px; flex-wrap: wrap;">
            ${currentNote.tags.map(tag => `<span style="background: #f3e8ff; color: #7c3aed; padding: 4px 12px; border-radius: 20px; font-size: 12px;">${tag}</span>`).join('')}
          </div>
        ` : ''}
      `;
      document.body.appendChild(tempDiv);

      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      document.body.removeChild(tempDiv);

      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `${currentNote.title}.png`);
        }
      });

      setExportStatus(isRTL ? '✓ تصویر ذخیره شد' : '✓ Image saved');
      setTimeout(onClose, 1500);
    } catch (err) {
      console.error('Export failed:', err);
      setExportStatus(isRTL ? '✗ خطا در ذخیره' : '✗ Export failed');
    }
    setIsExporting(false);
  };

  const exportAsPDF = async () => {
    setIsExporting(true);
    setExportStatus(isRTL ? 'در حال تبدیل به PDF...' : 'Converting to PDF...');

    try {
      const { title, date, content } = getExportContent();

      // Create temp element
      const tempDiv = document.createElement('div');
      tempDiv.style.cssText = `
        position: fixed; top: -9999px; left: -9999px;
        width: 800px; padding: 60px; background: white;
        font-family: 'Vazirmatn', 'Calibri', sans-serif;
        direction: ${isRTL ? 'rtl' : 'ltr'};
      `;
      tempDiv.innerHTML = `
        <div style="border-bottom: 3px solid #7c3aed; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="font-size: 28px; color: #1a1a2e; margin: 0 0 8px 0;">${title}</h1>
          <p style="color: #6b7280; font-size: 14px; margin: 0;">${date}</p>
        </div>
        <div style="font-size: 16px; line-height: 1.8; color: #374151; white-space: pre-wrap;">${content}</div>
      `;
      document.body.appendChild(tempDiv);

      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      document.body.removeChild(tempDiv);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${currentNote.title}.pdf`);

      setExportStatus(isRTL ? '✓ PDF ذخیره شد' : '✓ PDF saved');
      setTimeout(onClose, 1500);
    } catch (err) {
      console.error('PDF export failed:', err);
      setExportStatus(isRTL ? '✗ خطا در ذخیره PDF' : '✗ PDF export failed');
    }
    setIsExporting(false);
  };

  const exportAsWord = () => {
    setIsExporting(true);
    setExportStatus(isRTL ? 'در حال تبدیل به Word...' : 'Converting to Word...');

    try {
      const { title, date, content } = getExportContent();

      const htmlContent = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office"
              xmlns:w="urn:schemas-microsoft-com:office:word"
              xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <meta charset="utf-8">
          <style>
            @page { margin: 2cm; }
            body {
              font-family: 'Vazirmatn', 'B Nazanin', 'Calibri', sans-serif;
              direction: ${isRTL ? 'rtl' : 'ltr'};
              font-size: 14pt;
              line-height: 1.8;
              color: #333;
            }
            h1 { color: #7c3aed; font-size: 22pt; border-bottom: 2px solid #7c3aed; padding-bottom: 10px; }
            .date { color: #666; font-size: 11pt; margin-bottom: 20px; }
            .tags { margin-top: 30px; }
            .tag { background: #f3e8ff; color: #7c3aed; padding: 3px 10px; border-radius: 12px; font-size: 10pt; display: inline-block; margin: 2px; }
            .checklist-item { margin: 4px 0; }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <p class="date">${date}</p>
          <div>${content.replace(/\n/g, '<br>')}</div>
          ${currentNote.checklist ? `
            <div style="margin-top: 20px;">
              ${currentNote.checklist.map(item => `
                <div class="checklist-item">${item.checked ? '☑' : '☐'} ${item.text}</div>
              `).join('')}
            </div>
          ` : ''}
          ${currentNote.tags.length > 0 ? `
            <div class="tags">
              ${currentNote.tags.map(tag => `<span class="tag">${tag}</span>`).join(' ')}
            </div>
          ` : ''}
        </body>
        </html>
      `;

      const blob = new Blob([htmlContent], {
        type: 'application/msword',
      });
      saveAs(blob, `${currentNote.title}.doc`);

      setExportStatus(isRTL ? '✓ فایل Word ذخیره شد' : '✓ Word file saved');
      setTimeout(onClose, 1500);
    } catch (err) {
      console.error('Word export failed:', err);
      setExportStatus(isRTL ? '✗ خطا در ذخیره Word' : '✗ Word export failed');
    }
    setIsExporting(false);
  };

  const exportAsPages = () => {
    setIsExporting(true);
    setExportStatus(isRTL ? 'در حال آماده‌سازی برای Pages...' : 'Preparing for Pages...');

    try {
      const { title, date, content } = getExportContent();

      // Apple Pages can open .docx files - we export as docx-compatible format
      const htmlContent = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office"
              xmlns:w="urn:schemas-microsoft-com:office:word"
              xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <meta charset="utf-8">
          <style>
            @page {
              size: A4;
              margin: 2.54cm;
            }
            body {
              font-family: 'Vazirmatn', 'Geeza Pro', 'Calibri', sans-serif;
              direction: ${isRTL ? 'rtl' : 'ltr'};
              font-size: 12pt;
              line-height: 2.0;
              color: #1a1a1a;
            }
            h1 {
              color: #5b21b6;
              font-size: 24pt;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .subtitle {
              color: #6b7280;
              font-size: 10pt;
              font-style: italic;
              margin-bottom: 24px;
            }
            .content {
              white-space: pre-wrap;
            }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <p class="subtitle">${date}</p>
          <div class="content">${content}</div>
          ${currentNote.checklist ? `
            <br><br>
            ${currentNote.checklist.map(item => `
              <p>${item.checked ? '☑' : '☐'} ${item.text}</p>
            `).join('')}
          ` : ''}
        </body>
        </html>
      `;

      // Export as .doc which Pages can open
      const blob = new Blob(['\ufeff' + htmlContent], {
        type: 'application/vnd.apple.pages',
      });
      saveAs(blob, `${currentNote.title}.doc`);

      setExportStatus(isRTL ? '✓ فایل Pages ذخیره شد' : '✓ Pages file saved');
      setTimeout(onClose, 1500);
    } catch (err) {
      console.error('Pages export failed:', err);
      setExportStatus(isRTL ? '✗ خطا در ذخیره Pages' : '✗ Pages export failed');
    }
    setIsExporting(false);
  };

  const exportOptions = [
    {
      id: 'image',
      label: isRTL ? 'تصویر (PNG)' : 'Image (PNG)',
      icon: 'fa-image',
      color: 'from-green-400 to-emerald-500',
      description: isRTL ? 'خروجی به فرمت تصویر' : 'Export as image file',
      action: exportAsImage,
    },
    {
      id: 'pdf',
      label: isRTL ? 'سند PDF' : 'PDF Document',
      icon: 'fa-file-pdf',
      color: 'from-red-400 to-rose-500',
      description: isRTL ? 'خروجی به فرمت PDF' : 'Export as PDF document',
      action: exportAsPDF,
    },
    {
      id: 'word',
      label: isRTL ? 'مایکروسافت Word' : 'Microsoft Word',
      icon: 'fa-file-word',
      color: 'from-blue-400 to-blue-600',
      description: isRTL ? 'خروجی به فرمت Word' : 'Export as Word document',
      action: exportAsWord,
    },
    {
      id: 'pages',
      label: isRTL ? 'اپل Pages' : 'Apple Pages',
      icon: 'fa-file-alt',
      color: 'from-orange-400 to-amber-500',
      description: isRTL ? 'خروجی سازگار با Pages' : 'Export compatible with Pages',
      action: exportAsPages,
    },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 w-[90%] max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <i className="fas fa-file-export text-violet-500"></i>
            {isRTL ? 'خروجی یادداشت' : 'Export Note'}
          </h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600">
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Status */}
        {exportStatus && (
          <div className={`mb-4 p-3 rounded-xl text-sm text-center ${
            exportStatus.includes('✓') ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' :
            exportStatus.includes('✗') ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' :
            'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
          }`}>
            {isExporting && <i className="fas fa-spinner fa-spin ml-2"></i>}
            {exportStatus}
          </div>
        )}

        {/* Export Options */}
        <div className="grid grid-cols-2 gap-3">
          {exportOptions.map(option => (
            <button
              key={option.id}
              onClick={option.action}
              disabled={isExporting}
              className="p-4 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-violet-200 dark:hover:border-violet-700 hover:shadow-md transition-all text-center group disabled:opacity-50"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${option.color} flex items-center justify-center mx-auto mb-3 shadow-md group-hover:scale-110 transition-transform`}>
                <i className={`fas ${option.icon} text-white text-lg`}></i>
              </div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{option.label}</p>
              <p className="text-[10px] text-gray-400 mt-1">{option.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
