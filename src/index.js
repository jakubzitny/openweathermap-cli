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

    const description =
      validatedData.weather &&
      validatedData.weather[0] &&
      validatedData.weather[0].description;
    const formattedDescription = description ? `— ${description} ` : '';

    // NOTE: Display results:
    console.log();
    console.log(`Weather in ${args.city || args.zip} ${formattedDescription}`);
    console.log(`Temperature: ${temp}${formatScale(args.scale)}`);
    if (validatedData.main.humidity) {
      console.log(`Humidity: ${validatedData.main.humidity}`);
    }
  } catch (error) {
    console.error(error.message);
    services.process.exit(1);
  }
};

try {
  main();
} catch (e) {
  console.error(e);
}
