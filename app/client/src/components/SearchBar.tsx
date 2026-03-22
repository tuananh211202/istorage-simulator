import { FormEvent, useEffect, useState } from "react";

type SearchBarProps = {
  initialValue: string;
  onSubmit: (value: string) => void;
  disabled?: boolean;
};

export function SearchBar({
  initialValue,
  onSubmit,
  disabled = false,
}: SearchBarProps) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(value.trim());
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <label className="search-bar__label" htmlFor="image-search">
        Search images
      </label>
      <div className="search-bar__controls">
        <input
          id="image-search"
          className="search-bar__input"
          type="search"
          placeholder="Search by keyword"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          disabled={disabled}
        />
        <button className="search-bar__button" type="submit" disabled={disabled}>
          Search
        </button>
      </div>
    </form>
  );
}
