// @flow

import { initServices } from './service-factory';
import { validateApiData } from './api/openweathermap-api-requestor';
import { convertScale, formatScale } from './utils/scale-converter';

import type { Args } from './cli-parser';

const runForLocation = async (location: string, args: Args, services: *) => {
  const data = await services.openWeatherMapApiRequestor.fetch(location);
  const validatedData = validateApiData(data);
  const temp = convertScale(validatedData.main.temp, args.scale);

  const description =
    validatedData.weather &&
    validatedData.weather[0] &&
    validatedData.weather[0].description;
  const formattedDescription = description ? `— ${description} ` : '';

  // NOTE: Display results:
  console.log();
  console.log(`Weather in ${location} ${formattedDescription}`);
  console.log(`Temperature: ${temp}${formatScale(args.scale)}`);
  if (validatedData.main.humidity) {
    console.log(`Humidity: ${validatedData.main.humidity}`);
  }
};

const main = async () => {
  const services = initServices();

  try {
    const args = await services.cliParser.initCliParser();

    // NOTE: Multi-location config
    if (args.import && args.locations.length) {
      args.locations.forEach(async (location) => {
        if (!location) {
          return;
        }

        await runForLocation(location, args, services);
      });

      return;
    }

    // NOTE: Regular, one-location
    services.cliParser.saveConfig(args);
    runForLocation(args.city || args.zip, args, services);
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
