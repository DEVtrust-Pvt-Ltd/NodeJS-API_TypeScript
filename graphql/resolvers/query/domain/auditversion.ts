import { AuditVersion } from '../../../../database/document/auditVersion';
import { GraphQLContext } from "../../../utility/graphql";

export const getAuditVersion = async (
  _: any,
  { did }: { did: string },
  { userId }: GraphQLContext
) => {
  const auditFiles = await AuditVersion.createQueryBuilder("audit")
    .where({ domainId: did })
    .andWhere("audit.auditType IN (:...types)", { types: ["Journey", "Audit", "Video"] })
    .getMany();

  const groupedFiles = auditFiles.reduce<{
    journeyFiles: AuditVersion[];
    auditFiles: AuditVersion[];
    videoFiles: AuditVersion[];
  }>(
    (groups, file) => {
      if (file.auditType === "Journey") {
        groups.journeyFiles.push(file);
      } else if (file.auditType === "Audit") {
        groups.auditFiles.push(file);
      } else if (file.auditType === "Video") {
        groups.videoFiles.push(file);
      }
      return groups;
    },
    {
      journeyFiles: [],
      auditFiles: [],
      videoFiles: []
    }
  );

  return groupedFiles;
};

