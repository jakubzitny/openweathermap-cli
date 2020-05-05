// @flow

import { initServices } from './service-factory';
import { validateApiData } from './api/openweathermap-api-requestor';
import { convertScale, formatScale } from './utils/scale-converter';

const main = async () => {
  const services = initServices();

  const args = await services.cliParser.initCliParser();

  try {
    // NOTE: Try saving the current config, continue if it fails.
    services.cliParser.saveConfig(args);
  } catch (configError) {
    console.warn('There is a problem with saving your config', configError);
  }

  try {
    const data = await services.openWeatherMapApiRequestor.fetch(
      args.city || args.zip
    );
    const validatedData = validateApiData(data);
    const temp = convertScale(validatedData.main.temp, args.scale);
    console.log(temp, formatScale(args.scale));
  } catch (error) {
    console.error(error);
  }
};

try {
  main();
} catch (e) {
  console.error(e);
}
