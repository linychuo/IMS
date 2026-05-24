import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ExportTemplate {
  id: string;
  name: string;
  reportType: string;
  fields: string[];
  createdAt: string;
}

interface ExportTemplateStore {
  templates: ExportTemplate[];
  addTemplate: (name: string, reportType: string, fields: string[]) => void;
  deleteTemplate: (id: string) => void;
  getTemplatesByType: (reportType: string) => ExportTemplate[];
}

export const useExportTemplateStore = create<ExportTemplateStore>()(
  persist(
    (set, get) => ({
      templates: [],

      addTemplate: (name: string, reportType: string, fields: string[]) => {
        const newTemplate: ExportTemplate = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name,
          reportType,
          fields,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          templates: [...state.templates, newTemplate],
        }));
      },

      deleteTemplate: (id: string) => {
        set((state) => ({
          templates: state.templates.filter((t) => t.id !== id),
        }));
      },

      getTemplatesByType: (reportType: string) => {
        return get().templates.filter((t) => t.reportType === reportType);
      },
    }),
    {
      name: 'export-templates-storage',
    }
  )
);