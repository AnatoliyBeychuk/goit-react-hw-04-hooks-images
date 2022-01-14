import { useState } from "react";
import PropTypes from "prop-types";
import {
  Header,
  SearchForm,
  SearchFormButton,
  SearchFormInput,
} from "./Searchbar.styled";

function Searchbar({ onSubmit }) {
  const [query, setQuery] = useState("");

  const handleInputChange = (event) => {
    const { value } = event.target;
    setQuery(value);
  };

  return (
    <Header>
      <SearchForm
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(query);
        }}
      >
        <SearchFormButton type="submit" aria-label="Search"></SearchFormButton>

        <SearchFormInput
          className="input"
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          onChange={handleInputChange}
        />
      </SearchForm>
    </Header>
  );
}

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default Searchbar;
