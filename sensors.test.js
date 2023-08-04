const  {
    truncateString,
    createTestSensorData,
    createTestSensorDatum, 
    createName,
    formatName,
    createCoordinate, 
    validateCoordinate,
    createLocation,
    formatLocation,
    parseLongitudeLatitude,
    randomInRange,
    getRandomDirection,
    createLatitude,
    createLongitude,
    createListOfTags,
    formatTags,
    formatTag
} = require('./src/sensors.js');

test('properly create sensor datum', ()=> {

    let datum  = createTestSensorDatum({
        name: '',
        location: '',
        tags: []
    })

    expect(datum).toEqual({
        name: '',
        location: '',
        tags: []
    })
})

test('properly create sensor name', ()=> {

    expect(createName({sensor_index: 1})).toBe('sensor-1');
})

test('properly format sensor names', ()=> {

    let name_1 = createName({sensor_index: 1234567});

    let name_2 = createName({sensor_index: '12345678901234567890'});

    expect(name_1).toBe('sensor-1234567');

    expect(name_2).toBe('sensor-12345678901234567890');

    let formatted_name_1 = formatName({name: name_1});

    let formatted_name_2 = formatName({name: name_2});

    expect(formatted_name_1).toBe(name_1);

    expect(formatted_name_2).toBe('sensor-12345...');
})

test('properly create longigutde-latitude coordinates', ()=>{

    expect(createLocation({
        latitude_options: {type: 'Latitude', degree: 90, direction: 'N'},
        longitude_options: {type: 'Longitude', degree: 90, direction: 'S'}
    })).toBe(`Latitude: 90 N, Longitude: 90 S`);
})

test('properly format location', ()=> {

    let degree_lat = 45.12345;

    let degree_long = 90.123456

    let location = createLocation({
        latitude_options: {type: 'Latitude', degree: degree_lat, direction: 'N'},
        longitude_options: {type: 'Longitude', degree: degree_long, direction: 'S'}
    });

    expect(location).toBe(`Latitude: ${degree_lat} N, Longitude: ${degree_long} S`);

    let {longitude_number, latitude_number, longitude_direction, latitude_direction} = parseLongitudeLatitude({location: location});

    expect(longitude_direction).toBe('S');

    let formatted_location = formatLocation({location: location});

    expect(formatted_location).toBe(`Latitude: ${degree_lat} N, Longitude: 90.12... S`);
})

test('properly catch coordinate creation errors', ()=>{

    let error_check_1 = validateCoordinate({
        type: 'Latitude',
        degree: 90,
        direction: 'N' 
    }); 

    expect(error_check_1).toEqual(false);

    let error_check_2 = validateCoordinate({
        type: 'L',
        degree: 90,
        direction: 'N'
    });

    expect(error_check_2).toBe(`Invalid coordinate type`);

    let error_check_3 = validateCoordinate({
        type: 'Latitude',
        degree: '90',
        direction: 'N'
    });

    expect(error_check_3).toBe(`Latitude degree must be a number`);

    let error_check_4 = validateCoordinate({
        type: 'Longitude',
        degree: 90,
        direction: 'A'
    })

    expect(error_check_4).toBe(`Invalid direction`);

    let error_check_5 = validateCoordinate({
        type: 'Longitude',
        degree: '90',
        direction: 'N',
        degree_accept_string: true
    })

    expect(error_check_5).toEqual(false);
})

test('properly returns location coordinates', ()=>{

    expect(createCoordinate({type: 'Latitude', degree: 90, direction: 'N'})).toBe('Latitude: 90 N');
})

test('properly parse location coordinates', ()=>{

    let location = createLocation({
        latitude_options: {type: 'Latitude', degree: 45, direction: 'N'},
        longitude_options: {type: 'Longitude', degree: 90, direction: 'S'}
    });

    expect(parseLongitudeLatitude({location: location})).toEqual({longitude_number: 90, longitude_direction: 'S', latitude_number: 45, latitude_direction: 'N'},);
})

test('properly returns latitude', ()=>{

    expect(createLatitude({degree: 80, direction: 'S'})).toBe('Latitude: 80 S');
})

test('properly returns longitude', ()=>{

    expect(createLongitude({degree: 70, direction: 'N'})).toBe('Longitude: 70 N');
})

test('properly create list of tags', ()=> {

    let result = createListOfTags({sensor_index: 0, num_tags: 5});

    expect(result).toBeInstanceOf(Array);

    expect(result).toHaveLength(5);
})

test('properly format tag', ()=> {

    let tag_1 = 'tag-1';

    let tag_2 = 'tag-12345678';

    let formatted_tag_1 = formatTag({tag: tag_1});

    let formatted_tag_2 = formatTag({tag: tag_2});

    expect(formatted_tag_1).toBe(tag_1);

    expect(formatted_tag_2).toBe('tag-123...');
})

test('properly get random direction', ()=> {

    expect(getRandomDirection('N','W')).toMatch(/N|W/);

    expect(getRandomDirection('N','S','E')).toMatch(/N|S|E/);
})

test('ensure randomInRange is working properly', ()=>{

    const num_tests = 10;

    for(let i = 0; i < num_tests; i++){

        let min = i;

        let max = i + 5;

        let random_value = randomInRange({min: min, max: max});

        expect(random_value).toBeGreaterThanOrEqual(min);
        expect(random_value).toBeLessThan(max);
    }
})

