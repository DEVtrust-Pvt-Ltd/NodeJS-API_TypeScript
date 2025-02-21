import { Template } from "../../../database/template/template";
import { TemplateInput } from "../../../types/template";

// Function to create and save a template
export const createTemplate = async (
  _: null,
  { input }: { input: TemplateInput },
) => {
  const existingTemplate = await Template.findOne({ where: { title: input.title } });
  if (existingTemplate) throw new Error("Template with the same title already exists");
  const template = await Template.createQueryBuilder()
    .insert()
    .values({ ...input })
    .output("*")
    .execute()
    .then((response) => {
      if (!Array.isArray(response.raw) || response.raw.length === 0) {
        throw new Error("Failed to create template");
      }

      return response.raw[0];
    });

  return template;
};
