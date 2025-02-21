import { Template } from "../../../database/template/template";
import { UpdateTemplateInput } from "../../../types/template";

// update template by id
export const updateTemplate = async (
  _: null,
  { input }: { input: UpdateTemplateInput },
) => {
  const { id, ...rest } = input;
  const template = await Template.createQueryBuilder()
    .update(rest)
    .where({ id })
    .output("*")
    .execute()
    .then((response) => {
      if (!Array.isArray(response.raw) || response.raw.length === 0) {
        throw new Error("Failed to update template data");
      }
      return response.raw[0];
    });
  return await template;
};
