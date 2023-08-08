

class Validation {

    static location_type = new Set(['Longitude', 'Latitude']);

    static location_direction = new Set(['N','S','E','W'])
}

const elipsis_length = 3;

/*
    This function takes in two numbers describing how many rows of sensor data to create, and
    how many tags each sensor should have, and returns an array of fake sensor data

    :param num_sensors [Number] - Number of sensor data entries to create
    :param num_tags_per_sensor [Number] - Number of tags to add for eachs sensor
    :return sensors [Array] - List of fake sensor data
*/
function createTestSensorData({
    num_sensors = 10,
    num_tags_per_sensor = 5
}){

    let sensors = [];

    for(let sensor_index = 0; sensor_index < num_sensors; sensor_index++){

        let sensor = createTestSensorDatum({
            sensor_index: sensor_index,
            num_tags_per_sensor: num_tags_per_sensor
        })

        sensors.push(sensor);
    }

    return sensors;
}

/*
    This function takes in information needed to describe an individual row of sensor data,
    and returns an object that fully describes the sensor data for that row.

    :param new_data [Boolean] - Describes whether or not this is automatically generated test data,
    or user created data via the UI. If this is user generated data, then the name, location, and tags 
    will be set to non-null default values
    :param name [String] - The name of the sensor 
    :param sensor_index [Number] - The index of the sensor in the array of sensor data (used if row is generated without user input)
    :param location [String] - The latitutde and longitude of sensor data
    :param num_tags_per_sensor [Number] - The number of tags for this sensor (used if row is generated without user input)
    :param tags [Array] - The list of tags for this sensor
    :return [Object] with name, location, and list of tags for the sensor row
*/
function createTestSensorDatum({
    new_data = false,
    name,
    sensor_index,
    location,
    num_tags_per_sensor,
    tags
}){

    if(new_data){

        name = '';
        location = '';
        tags = []
    }
    
   return {
        name: name != null ? name : createName({sensor_index}),
        location: location  != null ? location : createLocation({}),
        tags: tags != null ? tags : createListOfTags({sensor_index: sensor_index, num_tags: num_tags_per_sensor})
    }
}

/*
    This function takes in the sensor's index, and returns the name the test sensor

    param: sensor_index [Number] - The index of the sensor in the data
    return: [String] - The name of the sensor index
*/
function createName({sensor_index}){

    return `sensor-${sensor_index}`;
}

/*
    This function ensures a sensor name is valid

    param: name [String] - The name of the sensor

    return: error [Boolean or String] - Error message is false if no error is detected, otherwise it contains a message
*/
function validateName({name}){

    let error = false;

    if(name.length <= 0){

        error = 'Invalid name';
    }

    return error;
}


/*
    This function formats the name the user sees in the UI by truncating the visible string
    if there are too many characters to fit cleanly on the screen

    param: name [String] - The name of the sensor
    return: [String] truncated name
*/
function formatName({name}){

    let max_length_visible = 15;

    return truncateString({str: name, max_length: max_length_visible});
  }

/*
  This function takes in longitude and latitude information to create a string describing the sensor location

  param: latitude_options [Object] - Describes latitude
  param: longitude_options [Object] - Describes longitude
  return [String] - String showing the latitude and longitude
*/
function createLocation({
    latitude_options = {},
    longitude_options = {}
}){

    return `${createLatitude(latitude_options)}, ${createLongitude(longitude_options)}`
}

/*
    This function parses the sensor location to ensure that it is valid.

    param: location [String] - The sensor location
    return: error [Boolean or String] - error message is false if no error is detected, otherwsie returns an error message
*/
function validateLocation({
    location
}){

    let error = false;

    try {

        let {longitude_number,latitude_number,longitude_direction,latitude_direction} = parseLongitudeLatitude({location: location});

        if(longitude_number == null || latitude_number == null || longitude_direction == null || latitude_direction == null){

            error = 'Invalid location: undefined data';
        }

        [latitude_direction, longitude_direction].map(item => {
            
            if(!Validation.location_direction.has(item)){

                error = `Invalid location: bad direction`
            }
        })

        console.log(`validateLocation longitude_number ${longitude_number} latitude_number ${latitude_number},longitude_direction ${longitude_direction},latitude_direction ${latitude_direction}`);

        return error;
    }
    catch(error){

        return error;
    }
}

/*
    This function validates a longitude or latitude coordinate 

    param: type [String] - Type of coordinate. Should be either "Latitude" or "Longitude"
    param: degree [Number or String] - The actual number for latitude/longitude. Should be a number if created by test function.
    If created via UI, then it will be a string
    param: direction [String] - Should be either N,S,E,W
    param: degree_accept_string [Boolean] - Degree takes string if created via UI. Otherwise, it's a number.
*/
function validateCoordinate({
    type,
    degree,
    direction,
    degree_accept_string
}){

    let error_message = false;

    if(!Validation.location_type.has(type)){

        error_message = `Invalid coordinate type`;
    }
    else if(typeof degree == 'string' && !degree_accept_string){

        error_message = `${type} degree must be a number`;
    }
    else if(!Validation.location_direction.has(direction)){

        error_message = `Invalid direction`;
    }
    
    return error_message;
}

/*
    This function takes in information to describe latitude or longitude coordaintes
    and returns a complete string description of the coordinate

    param: type [String] - Type of coordinate (Latitude or Longitude)
    param: degree [Number] - the actual numeric measure of the coordinate
    param: direction [String] - N,S,E,W
    param: degree_acept_string [Boolean] - true if coordinate is created by user, false otherwise
*/
function createCoordinate({
    type,
    degree,
    direction,
    degree_accept_string = false
}){

    let {error, error_message} = validateCoordinate(arguments[0]);

    if(error){

        alert(error_message);

        return;
    }

    return `${type}: ${degree} ${direction}`;
}

/*
    This function returns a random number between min and max

    param: min [Number] - the minimum
    param: max [Number] - the maximum
    return: [Number]
*/
function randomInRange({min, max}){

    return Math.random() * (max - min) + min;
}

/*
    This function returns a random direction of N,S,E,W

    param: arguments [Array] - Array of possible directions to choose from
    Should be [N,S] if creating a latitude and [E,W] if creating a longitude
    return: [String]
*/
function getRandomDirection() {

    let directions = arguments;

    let num_directions = arguments.length;

    let random_index = Math.floor(Math.random() * num_directions);

    return directions[random_index];
}

/*
    This function creates a string describing the latitude

    param: degree [Number] - the actual numeric measure of the latitude
    param: direction [String]

    return: [String] the description of the latitude
*/
function createLatitude({
    degree = randomInRange({min: 0, max: 90}),
    direction = getRandomDirection('N','S')
}){
    return createCoordinate({type: 'Latitude', degree: degree, direction: direction});
}

/*
    This function parses a coordinate string into it's measure and direction for longitude and latitude

    param: location [String] - Longitude and latitude string of form `Latitude: Measure Direction, Longitude: Measure Direction`

    return: [Object] with keys for both latitude/longitude number and direction
*/
function parseLongitudeLatitude({location}){

    //L: N1.N2 Dir, L N3.N4, Dir

    if(location == ''){

        return {
            longitude_number: '',
            latitude_number: '',
            longitude_direction: '',
            latitude_direction: ''
        }
    }

    let separate_longitude_latitude = location.split(',');

    let latitude_text = separate_longitude_latitude[0];

    let longitude_text = separate_longitude_latitude[1];

    let longitude_number_and_direction = longitude_text.split(':')[1].trim();

    let latitude_number_and_direction = latitude_text.split(':')[1].trim();

    let longitude_number = longitude_number_and_direction.split(' ')[0];

    let latitude_number = latitude_number_and_direction.split(' ')[0];

    let longitude_direction = longitude_number_and_direction.split(' ')[1];

    let latitude_direction = latitude_number_and_direction.split(' ')[1];

    return {
        longitude_number: Number(longitude_number),
        latitude_number: Number(latitude_number),
        longitude_direction: longitude_direction,
        latitude_direction: latitude_direction
    }
}

/*
    This function formats a location string for UI

    param: location [String] - The latitude and longitude coordinates
    return [String] - new location string with abbreviated latitude and longitude coordinates (f necessary)
*/
function formatLocation({location}){

    if(location == ''){

        return location;
    }
    
    const max_num_characters = 8; //10.12345

    let {longitude_number, latitude_number, longitude_direction, latitude_direction} = parseLongitudeLatitude({location: location});

    let longitude_number_string = truncateString({str: String(longitude_number), max_length: max_num_characters});

    let latitude_number_string = truncateString({str: String(latitude_number), max_length: max_num_characters});

    return createLocation({
        latitude_options: {
            type: 'Latitude',
            degree: latitude_number_string,
            direction: latitude_direction,
            degree_accept_string: true
        },
        longitude_options: {
            type: 'Longitude',
            degree: longitude_number_string,
            direction: longitude_direction,
            degree_accept_string: true
        }
    })
}

/*
    This function creates a longitude coordinate

    param: degree [Number] - Measure of longitude
    param: direction [String] - Direction should be E or W
    return: [String] Description of longitude
*/
function createLongitude({
    degree = randomInRange({min: 0, max: 180}),
    direction = getRandomDirection('E','W')
}){

    return createCoordinate({type: 'Longitude', degree: degree, direction: direction});
}

/*
    This function formats a tag for UI

    param: tag [String] - the tag text in the list of tags for a given sensor
    return: [String] - abbreviated (if necessary) tag text
*/
function formatTag({tag}){

    const max_length_tag = 10;

    return truncateString({str: tag, max_length: max_length_tag});
}

/*
    This function shortens a given string

    param: str [String] - the string to be truncated
    param: max_length [Number] - maximum length a string can be until it needs to be truncated
    return: [String] - the truncated string
*/
function truncateString({str, max_length}){

    if(str.length <= max_length){

        return str;
    }

    return str.substring(0,max_length - elipsis_length) + '...';
}

/*
    This function formats the list of sensor tags for viewing in the UI

    param: tags [Array] - The Array of tags for a sensor
    return: [String] - The first few formatted tags separated by commas
*/
function formatTags({tags}){

    if(tags == []){

        return '';
    }

    let error = validateTags({tags: tags});

    if(error){

        alert(error);
        
        return;
    }

    let formatted_tags = ``;

    const max_number_tags_display = 5;

    for(let tag_index = 0; tag_index < Math.min(tags.length, max_number_tags_display); tag_index++){

        let formmated_tag = formatTag({tag: tags[tag_index]});

        formatted_tags += tag_index == 0? formmated_tag : ', ' + formmated_tag;
    }

    return formatted_tags;
}

/*
    This function creates a list of tags for a test sensor

    param: sensor_index [Number] - The index of the sensor in the data
    param: num_tags [Number] - The number of tags to create for this sensor
    return: [Array] - The array of tags
*/  
function createListOfTags({sensor_index, num_tags}){

    let tags = [];

    for(let tag_index = 0; tag_index < num_tags; tag_index++){

        tags.push(`tag-${sensor_index}-${tag_index}`);
    }

    return tags;
}

/*
    This function validates the list of tags is structured properly

    param: tags [Array] - the list of tags
    return [Boolean or String] - false if no error, otherwise it returns an error message
*/  
function validateTags({tags}){

    let error = false;

    for(let tag of tags){

        if(tag.length == 0){

            return 'Invalid tags';
        }
    }

    return error;
}

module.exports = {
    createName,
    formatName,
    validateName,
    createTestSensorData, 
    createTestSensorDatum,
    createLocation,
    validateLocation,
    createCoordinate, 
    validateCoordinate,
    formatLocation,
    parseLongitudeLatitude,
    randomInRange,
    getRandomDirection,
    createLatitude,
    createLongitude,
    createListOfTags,
    validateTags,
    formatTags,
    formatTag,
    truncateString
}