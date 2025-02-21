import { In } from "typeorm";
import { Template } from "../../../../database/template/template";

// Get templates by multiple sections
export const templates = async (
) => {
  const sections = ["Demand", "GlobalSettlement", "Affidavit", "ClientInvoice", "DigitalComplianceLabInvoice", "WaiverofPersonalService"];

  // Fetch templates for the specified sections
  const templates = await Template.find({ where: { section: In(sections) } });

  // Group templates by section
  const groupedTemplates = templates.reduce((acc, template) => {
    if (!acc[template.section]) {
      acc[template.section] = [];
    }
    acc[template.section].push(template);
    return acc;
  }, {} as Record<string, any[]>);
  return groupedTemplates;
};



// delete template by id
export const deleteTemplateById = async (
  _: any,
  { ids }: { ids: string[] },  // Adjusted type definition for array of strings
) => {
  const result = await Template.createQueryBuilder()
    .delete()
    .from(Template)  // Specify the entity directly
    .where("id IN (:...ids)", { ids })  // No need for an alias in delete queries
    .execute();

  if (result.affected === 0) {
    throw new Error("No template found to delete.");
  }

  return "Template has been successfully deleted.";
};


// get template by id
export const getTemplateById = async (
  _: any,
  { id }: { id: string },
) => {
  const template = await Template.createQueryBuilder().where({ id }).getOne();
  return template;
};
