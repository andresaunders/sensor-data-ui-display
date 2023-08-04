import React, {useState, useEffect} from 'react';

import './App.css';
import { 
  createTestSensorData, 
  createTestSensorDatum, 
  formatName, 
  validateName,
  formatLocation, 
  formatTags, 
  validateTags,
  parseLongitudeLatitude,
  validateLocation
} from './sensors';


function cursor(){

  return  'pointer';
}

function onMouseOverListener({element}){

  element.style.cursor = cursor();
}

function onMouseOutListener({element}){

  element.style.cursor = 'default';
}

function AddButton({style, setSensorData, getSensorData}){

  function handleButtonClick(){

      let sensor_data = getSensorData();

      let new_data = createTestSensorDatum({new_data: true})

      sensor_data = [new_data, ...sensor_data];

      setSensorData(sensor_data);
  }

  function handleMouseOver(e){

    return onMouseOverListener({element: e.target});
  }

  function handleMouseOut(e){

    return onMouseOutListener({element: e.target});
  }

  return (
    <>
    <div style={style} id='add-button-container'>
      <div onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
       onClick={()=> {
        handleButtonClick()
      }}>Add</div>
    </div>
    </>
  )
}

function DeleteButton({style, getSensorData, setSensorData, getDeleteIndices, setDeleteIndices}){

  function handleButtonClick(){

    let delete_indices = getDeleteIndices();

    let sensor_data = getSensorData();

    let new_sensor_data = [];

    for(let sensor_index = 0; sensor_index < sensor_data.length; sensor_index++){

      if(delete_indices.has(sensor_index)){
        continue;
      }

      new_sensor_data.push(sensor_data[sensor_index]);
    }

    setDeleteIndices(new Set());

    setSensorData(new_sensor_data);
  }


  function handleMouseOver(e){

    return onMouseOverListener({element: e.target});
  }

  function handleMouseOut(e){

    return onMouseOutListener({element: e.target});
  }

  return (
    <>
    <div style={style} id='delete-button-container'>
      <div 
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      onClick={()=>{
        handleButtonClick()
      }} >Delete</div>
    </div>
    </>
  )
}


function Header({setSensorData, getSensorData, setDeleteIndices, getDeleteIndices}){

  const header_style = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '50px',
    border: '1px solid black'
  }

  const column_style = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
  }

  return (
    <>
      <header style={header_style}>
        <AddButton setSensorData={setSensorData} getSensorData={getSensorData} style={column_style}/>
        <DeleteButton style={column_style} 
          setSensorData={setSensorData} 
          getSensorData={getSensorData} 
          setDeleteIndices={setDeleteIndices} 
          getDeleteIndices={getDeleteIndices}
          />
      </header>
    </>
  )
}


function SensorDataRow({
  setEditMode,
  setEditIndex,
  sensor_row_data, 
  setNameSearch,
  setLocationSearch,
  setTagsSearch,
  runSearch,
  role, 
  index, 
  getDeleteIndices, 
  delete_indices, 
  setDeleteIndices}){

  const [is_checked, setChecked] = useState(() =>{
    if(getDeleteIndices){

      console.log('in useState delete_indices: ', getDeleteIndices());

      return getDeleteIndices().has(index);
    }

    return false;
   });

  console.log('sensor_row_data: ', sensor_row_data, ', role: ', role, ', index: ', index, ', is_checked: ', is_checked, ', delete_indices: ', delete_indices ? delete_indices.size : null, ', getDeleteIndices: ', getDeleteIndices ? getDeleteIndices().size: null);

  useEffect(()=>{

    if(role != 'label') console.log('rerender: checked:', is_checked,', delete_indices: ', getDeleteIndices());

  },[is_checked]);

  useEffect(()=>{

    if(role != 'label'){

      setChecked(getDeleteIndices().has(index));
    }
  },
  [role, index, getDeleteIndices])

  const row_data_container_style = {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '75px',
    border: '1px solid black'
  }

  const name_style = {
    border: '1px solid black',
    width: '33%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }

  const location_style = {
    border: '1px solid black',
    width: '33%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }

  const tags_style = {
    border: '1px solid black',
    width: '33%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }

  const checkbox_style ={
    border: '1px solid black',
    width: '50px'
  }


  function handleCheckboxChange(){

    console.log('before is_checked: ', is_checked, ', delete_indices: ', delete_indices);

    if(!is_checked){

      delete_indices.add(index);

      setChecked(true);
    }
    else {

      delete_indices.delete(index);

      setChecked(false);
    }
    
    setDeleteIndices(delete_indices);

    console.log('after is_checked: ', is_checked, ', delete_indices: ', delete_indices);

  }

  function handleCheckboxClick(e){

    e.stopPropagation();
  }

  function handleRowClick(e){

    let element = e.target;

    setEditIndex(index);

    setEditMode(true);
  }

  function searchName(e){

    let value = e.target.value;

    setNameSearch(value);
  }

  function searchLocation(e){

    let value = e.target.value;

    setLocationSearch(value);
  }

  function searchTags(e){

    let value = e.target.value;

    setTagsSearch(value);
  }

  const search_style = {
    width: '100px',
    marginLeft: '20px',
    height: '20px'
  }

  return (
    <>
      <div className="row-data-container" id={`sensor-row-${index}`} style={row_data_container_style} onClick={handleRowClick}>
        <div className='sensor-name-container' style={name_style}>
          {role !== 'label' && <input id={`sensor-row-${index}`} type='checkbox' checked={is_checked} style={checkbox_style} onChange={handleCheckboxChange} onClick={handleCheckboxClick}></input>}
          <div className="sensor-name-text" >{role == 'label' ? sensor_row_data.name : formatName({name: sensor_row_data.name})}</div>
          {role == 'label' && <input id="search-name" type="text" placeholder='search' style={search_style} onChange={searchName}></input>}
        </div>
        <div className="sensor-location-container" style={location_style}>
          <div className="sensor-location-text">{role == 'label' ? sensor_row_data.location : formatLocation({location: sensor_row_data.location})}</div>
          {role == 'label' && <input id="search-location" type="text" placeholder='search' style={search_style} onChange={searchLocation}></input>}
        </div>
        <div className="sensor-tags-container" style={tags_style}>
          <div className='sensor-tags-text'>
            {role == 'label' ? sensor_row_data.tags : formatTags({tags: sensor_row_data.tags})}
          </div>
          {role == 'label' && <input id="search-tags" type="text" placeholder='search' style={search_style} onChange={searchTags}></input>}
        </div>
      </div>
    </>
  )

}

function SensorDataDisplay({
  setEditMode,
  setEditIndex,
  sensor_data,
  setDeleteIndices,
  delete_indices,
  getDeleteIndices
}){

  const sensor_data_window_size = 10;

  console.log('sensor_data: ', sensor_data);

  const [start_index, setStartIndex] = useState(0);

  const [end_index, setEndIndex] = useState(Math.min(sensor_data_window_size - 1, sensor_data.length - 1));

  const [name_search, setNameSearch] = useState('');

  const [location_search, setLocationSearch] = useState('');

  const [tags_search, setTagsSearch] = useState('');

  const [hide_indices, setHideIndices] = useState(new Set())

  const filtered_sensor_data = sensor_data.filter((datum, index) => isSearchMatch(datum ,index))

  useEffect(()=>{

    //runSearch()

    console.log('hide_indices: ', hide_indices)
  }, [name_search, location_search, tags_search])


  function runSearch(){

    //check each group for matches
    //if !match hide index

    sensor_data.map((datum, index)=>{

       isSearchMatch(datum, index)
    })
  }

  function isSearchMatch(datum, index){

    let match_name = true;
    let match_location = true; 
    let match_tag = false;

    function allMatch(){

      return match_name && match_location && match_tag;
    }

    if(!datum.name.includes(name_search)){

      match_name = false;
    }
    if(!datum.location.includes(location_search)){

      match_location = false;
    }

    for(let tag_index = 0; tag_index < datum.tags.length; tag_index++){

      let tag = datum.tags[tag_index];

      if(tag.includes(tags_search)){

        match_tag = true;

        break;
      }
    }

    if(datum.tags.length == 0 && tags_search == ''){

      match_tag = true;
    }

    console.log(index, ' match name: ', match_name, ', match_location: ', match_location, ', match_tag: ', match_tag);

    return allMatch();
  }

  function shouldShowSensorDataRow(index){

    return !hide_indices.has(index);
  }

  return (
    <>
      <div>
        {<SensorDataRow 
          setEditMode={()=>{}}
          setEditIndex={()=>{}}
          setNameSearch={setNameSearch}
          setLocationSearch={setLocationSearch}
          setTagsSearch={setTagsSearch}
          runSearch={runSearch}
          key='label' 
          role='label' 
          sensor_row_data={{name: 'Name', location: 'Location', tags: 'Tags'}}>
        </SensorDataRow>}
        {filtered_sensor_data.map( (item, index) => 
         <SensorDataRow 
            key={index} 
            index={index} 
            role='data' 
            setEditMode={setEditMode}
            setEditIndex={setEditIndex}
            sensor_row_data={item}
            getDeleteIndices={getDeleteIndices}
            delete_indices={delete_indices}
            setDeleteIndices={setDeleteIndices}  
          /> 
        )}
      </div>
    </>
  )
}

function EditSensorDataRow({index, getSensorData, setSensorData, setEditMode}){

  let sensor_data = getSensorData();

  let sensor_datum = sensor_data[index];

  let parsed_location = parseLongitudeLatitude({location: sensor_datum.location});

  const [name, setName] = useState(sensor_datum.name);

  const [latitude, setLatitude] = useState(parsed_location.latitude_number);

  const [latitude_direction, setLatitudeDirection] = useState(parsed_location.latitude_direction);

  const [longitude, setLongitude] = useState(parsed_location.longitude_number);

  const [longitude_direction, setLongitudeDirection] = useState(parsed_location.longitude_direction);

  const [tags, setTags] = useState(sensor_datum.tags);

  const [selected_indices, setSelectedIndices] = useState(new Set());

  const header_style = {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '50px',
    borderBottom: '1px solid black'
  }

  const button_container_style = {
    display: 'flex',
    flexDirection: 'row',
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center'
  }

  function editButtonStyle({color}){
    return {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100px',
      textAlign: 'center'
    }
  }

  const edit_container_style = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flexStart',
    width: '100%',
    height: 'fit-content',
  }

  const edit_field_container_style = {
    display: 'flex', 
    flexDirection: 'row',
    justifyContent: 'flexStart',
    alignItems: 'center',
    height: 'fit-content',
    minHeight: '50px',
    width: '100%',
    border: '1px solid transparent',
    paddingLeft: '50px'
  }

  const item_style = {
    marginRight: '20px'
  }

  function handleDoneClick(e){

      let new_sensor_datum = createTestSensorDatum({
        name: name,
        location: `Latitude: ${latitude} ${latitude_direction}, Longitude: ${longitude} ${longitude_direction}`,
        tags: tags
      })

      sensor_data[index] = new_sensor_datum;

      let name_error = validateName({name: new_sensor_datum.name});

      let location_error = validateLocation({location: new_sensor_datum.location});

      let tags_error = validateTags({tags: new_sensor_datum.tags});

      let errors = [name_error, location_error, tags_error];

      for(let error of errors){

        if(error){

          alert(error);

          return;
        }
      }

      setSensorData(sensor_data);

      setEditMode(false);
  }

  function handleCancelClick(e){

    setEditMode(false);
  }

  function handleAddTag(){

    setTags((tags)=>{
      const new_tags = [...tags,'']
      return new_tags;
    })
  }

  function handleDeleteTags(){

    setTags((tags)=>{
      const new_tags = []; tags.map((tag, index) => {
        if(!selected_indices.has(index)){
          new_tags.push(tag);
        }
      })
      console.log('new_tags: ', new_tags);
      return new_tags;
    })

    setSelectedIndices(new Set());
  }

  function handleNameChange(e){

    setName(e.target.value);
  }

  function handleLatitudeChange(e){

    setLatitude(e.target.value);
  }

  function handleLatitudeDirectionChange(e){

    setLatitudeDirection(e.target.value);
  }

  function handleLongitudeChange(e){

    setLongitude(e.target.value);
  }

  function handleLongitudeDirectionChange(e){

    setLongitudeDirection(e.target.value);
  }

  function handleCheckboxChange({index}){

    setSelectedIndices((selected_indices) => {
      const new_selected_indices = new Set(selected_indices);
  
      if (new_selected_indices.has(index)) {
        new_selected_indices.delete(index);
      } else {
        new_selected_indices.add(index);
      }
  
      return new_selected_indices;
    });
  }

  function handleTagChange({index, e}){

    setTags((tags) => {
      const new_tags = [...tags];
      new_tags[index] = e.target.value;
      return new_tags;
    });
  }

  function handleMouseOver(e){

    return onMouseOverListener({element: e.target});
  }

  function handleMouseOut(e){

    return onMouseOutListener({element: e.target});
  }

  return(<>
    <header id="edit-header" style={header_style}>
      <div id="done-container" style={button_container_style}>
        <div 
        onClick={handleDoneClick} 
        style={editButtonStyle({color: 'green'})} 
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}>Done Editing</div>
      </div>
      <div id="cancel-container" style={button_container_style}>
        <div 
        onClick={handleCancelClick} 
        style={editButtonStyle({color: 'black'})} 
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}>Cancel</div>
      </div>
      <div id="add-container" style={button_container_style}>
        <div onClick={handleAddTag} 
        style={editButtonStyle({color: 'green'})} 
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}>Add Tag</div>
      </div>
      <div id="delete-container" style={button_container_style}>
        <div 
        onClick={handleDeleteTags} 
        style={editButtonStyle({color: 'red'})} 
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}>Delete Tags</div>
      </div>
    </header>
    <div id="edit-container" style={edit_container_style}>
      <div id="edit-name-container" style={edit_field_container_style}>
        <label style={item_style}>Name :</label>
        <input id="edit-name" type="text" value={name} style={item_style} onChange={handleNameChange}></input>
      </div>
      <div id="edit-location-container" style={edit_field_container_style}>
          <label style={item_style}>Location :</label>
         <label style={item_style}>Latitude</label>
         <input id="edit-lat-num" type="number" value={latitude} onChange={handleLatitudeChange} style={item_style}/>
         <input id="edit-lat-dir" type="text" value={latitude_direction} onChange={handleLatitudeDirectionChange} style={item_style}/>
         <label style={item_style}>Longitude</label>
         <input id="edit-long-num" type="number" value={longitude} onChange={handleLongitudeChange} style={item_style}/>
         <input id="edit-long-dir" type="text" value={longitude_direction} onChange={handleLongitudeDirectionChange} style={item_style}/>
      </div>
      <div id="edit-tags-container" style={edit_field_container_style}>
        <label style={item_style}>Tags :</label>
        {tags.map((item, index) => {
          return <>
              <input checked={selected_indices.has(index)} type="checkbox" onChange={()=>{
                handleCheckboxChange({index: index})
              }}></input>
              <input key={`tag-${index}`} className="edit-tag" type='text' value={item} onChange={(e)=>{handleTagChange({e:e, index: index})}} style={item_style}></input>
            </>
           
        })}
      </div>
    </div>
  </>)
}

function App() {

  const [sensor_data, setSensorData] = useState(createTestSensorData({}));

  const [delete_indices, setDeleteIndices] = useState(new Set());

  const [edit_mode, setEditMode] = useState(false);

  const [edit_index, setEditIndex] = useState();

  function getDeleteIndices(){

    return delete_indices;
  }

  function getSensorData(){

    return sensor_data;
  }

  useEffect(()=>{

  }, [sensor_data, delete_indices, edit_mode])

  return (
    <>
    {
      edit_mode ? 
        <EditSensorDataRow
          getSensorData={getSensorData}
          setSensorData={setSensorData}
          setEditMode={setEditMode}
          index={edit_index}
        /> : 
        <div id='app-container'>
        <Header
        setSensorData={setSensorData}
        getSensorData={getSensorData} 
        setDeleteIndices={setDeleteIndices} 
        getDeleteIndices={getDeleteIndices}/>
        <SensorDataDisplay 
        setEditMode={setEditMode}
        setEditIndex={setEditIndex}
        sensor_data={sensor_data} 
        getDeleteIndices={getDeleteIndices} 
        delete_indices={delete_indices} 
        setDeleteIndices={setDeleteIndices}/>
        </div>
    }
  
    </>
  );
}

export default App;
