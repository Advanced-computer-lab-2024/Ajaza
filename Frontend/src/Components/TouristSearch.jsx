import { useState } from "react";
import Search from "./Search"

export const TouristSearch = () => {
  const placesData = [
    { id: 1, name: "The Louvre", category: "Museum", tag: "Art" },
    { id: 2, name: "Colosseum", category: "Historical Place", tag: "Ancient Rome" },
    { id: 3, name: "Vatican Museum", category: "Museum", tag: "Religious" },
    { id: 4, name: "Hiking Trip", category: "Activity", tag: "Outdoor" },
    { id: 5, name: "Eiffel Tower Tour", category: "Itinerary", tag: "Landmark" },
  ];

  const [searchValue, setSearchValue] = useState("");
  const [filteredPlaces, setFilteredPlaces] = useState(placesData);

  
  const filterPlaces = (query) => {
    const lowerCaseQuery = query.toLowerCase();
    const filtered = placesData.filter(
      (place) =>
        place.name.toLowerCase().includes(lowerCaseQuery) ||
        place.category.toLowerCase().includes(lowerCaseQuery) ||
        place.tag.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredPlaces(filtered);
  };

  
  const handleSearchChange = (value) => {
    setSearchValue(value);
    filterPlaces(value); 
  };

  return (
    <div>
      
      <Search searchValue={searchValue} setSearchValue={handleSearchChange} size="m" />
      
      <div>
        <h3>Touristic Scenes</h3>
        {filteredPlaces.length > 0 ? (
          filteredPlaces.map((place) => (
            <div key={place.id}>
              <h4>{place.name}</h4>
              <p>Category: {place.category}</p>
              <p>Tag: {place.tag}</p>
            </div>
          ))
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </div>
  );
};
