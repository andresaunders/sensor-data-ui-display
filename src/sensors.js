

class Validation {

    static location_type = new Set(['Longitude', 'Latitude']);

    static location_direction = new Set(['N','S','E','W'])
}

const elipsis_length = 3;

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

function createName({sensor_index}){

    return `sensor-${sensor_index}`;
}

function validateName({name}){

    let error = false;

    if(name.length <= 0){

        error = 'Invalid name';
    }

    return error;
}

function formatName({name}){

    let max_length_visible = 15;

    return truncateString({str: name, max_length: max_length_visible});
  }

function createLocation({
    latitude_options = {},
    longitude_options = {}
}){

    return `${createLatitude(latitude_options)}, ${createLongitude(longitude_options)}`
}

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

function randomInRange({min, max}){

    return Math.random() * (max - min) + min;
}

function getRandomDirection() {

    let directions = arguments;

    let num_directions = arguments.length;

    let random_index = Math.floor(Math.random() * num_directions);

    return directions[random_index];
}

function createLatitude({
    degree = randomInRange({min: 0, max: 90}),
    direction = getRandomDirection('N','S')
}){
    return createCoordinate({type: 'Latitude', degree: degree, direction: direction});
}

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

function createLongitude({
    degree = randomInRange({min: 0, max: 180}),
    direction = getRandomDirection('E','W')
}){

    return createCoordinate({type: 'Longitude', degree: degree, direction: direction});
}

function formatTag({tag}){

    const max_length_tag = 10;

    return truncateString({str: tag, max_length: max_length_tag});
}

function truncateString({str, max_length}){

    if(str.length <= max_length){

        return str;
    }

    return str.substring(0,max_length - elipsis_length) + '...';
}

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

function createListOfTags({sensor_index, num_tags}){

    let tags = [];

    for(let tag_index = 0; tag_index < num_tags; tag_index++){

        tags.push(`tag-${sensor_index}-${tag_index}`);
    }

    return tags;
}

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