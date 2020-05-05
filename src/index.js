// @flow

import { initServices } from './service-factory';
import { validateApiData } from './api/openweathermap-api-requestor';
import { convertScale } from './utils/scale-converter';

const main = async () => {
  const services = initServices();

  const detectedLocation = detectLocation();
  const args = await services.cliParser.initCliParser(detectedLocation);

  try {
    // NOTE: Try saving config, continue if it fails.
    services.cliParser.saveConfig(args);
  } catch (configError) {
    console.warn('There is a problem with saving your config', configError);
  }

  try {
    const data = await services.openWeatherMapApiRequestor.fetch(
      args.city || args.c || args.zip || args.z
    );
    const validatedData = validateApiData(data);
    const temp = convertScale(validatedData.main.temp, args.scale);
    console.log(temp);
  } catch (error) {
    console.error(error);
  }
};

try {
  main();
} catch (e) {
  console.error(e);
}
