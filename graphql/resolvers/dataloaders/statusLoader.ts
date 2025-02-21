import { Status } from "../../../database/status/status";

import { AttornayDashboardStatus } from "../../../database/status/attornayDashboardStatus";

// get status by ids
export const getStatus = async (statusIds: readonly string[]): Promise<Status[]> => {
  const StatusMap: Map<string, Status> = new Map();
  const _ids = statusIds.map((id) => `${id}`);
  (await Status.findByIds(_ids)).map((status) =>
    StatusMap.set(status.id, status)
  );

  return _ids.map((inputId) => StatusMap.get(inputId) || null) as Status[];
};

// get Attornay Dashboard Status by id
export const getAttornayDashboardStatus = async (statusIds: readonly string[]): Promise<AttornayDashboardStatus[]> => {
  const StatusMap: Map<string, AttornayDashboardStatus> = new Map();
  const _ids = statusIds.map((id) => `${id}`);
  (await AttornayDashboardStatus.findByIds(_ids)).map((status) =>
    StatusMap.set(status.id, status)
  );

  return _ids.map((inputId) => StatusMap.get(inputId) || null) as AttornayDashboardStatus[];
};
