import axios from "axios";
import yenv from "yenv";
const env = yenv("env.yaml", { env: "development" });

export const fetchLightHouseScore = async (domainName: String) => {
  const apiUrl = `${env.GOOGLE_API_BASE_URL}pagespeedonline/v5/runPagespeed?url=${domainName}/&strategy=desktop`;
  let score: any = "";
  try {
    const response = await axios.get(apiUrl);
    score = response?.data?.lighthouseResult?.categories?.performance?.score * 100 || "";
  } catch (error) {
    throw new Error(`Failed to fetch score for domain: ${domainName}`);
    // console.error(`Failed to fetch score for domain: ${domainName}`, error);
  }

  return score;
};
