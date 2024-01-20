import properties from "../assets/properties.json";
import lgasData from "../assets/lgas.json"
import { Property, LGA } from "../types";

interface FetchDataMock {
  route: string;
  filters?: {
    code: number | null;
  };
}

const returnPromise = <T>(returnData: T) => {
  return new Promise<T>((resolve) => {
    // Simulate an asynchronous delay
    setTimeout(() => {
      resolve(returnData);
    }, 1000); // Simulating a 1-second delay
  });
};

export const useFetchMock = ({ route, filters }: FetchDataMock) => {
  if (route === "/properties") {
    let newProperties: Property[] = properties;
    if (filters?.code !== null && typeof filters?.code === "number") {
      newProperties = properties.filter(
        (property) => property.lga_code === filters?.code
      );
    }
    return returnPromise(newProperties);
  }
  else if (route === '/lgas') {
    const newLGA: LGA[] = lgasData;
    return returnPromise(newLGA);
  }

  return Promise.resolve(null);
};
