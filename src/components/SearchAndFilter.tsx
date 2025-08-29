'use client';

import {useState} from 'react';
import {availableTags} from '../data/mockTickets';
import {useTicketStore} from '../store/useTicketStore';

export const SearchAndFilter = () => {
  const {
    searchText,
    selectedTags,
    selectedPriority,
    setSearchText,
    setSelectedTags,
    setSelectedPriority,
  } = useTicketStore();

  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handlePriorityChange = (priority: 'low' | 'medium' | 'high' | null) => {
    setSelectedPriority(priority);
    setIsPriorityDropdownOpen(false);
  };

  const clearAllFilters = () => {
    setSearchText('');
    setSelectedTags([]);
    setSelectedPriority(null);
  };

  const priorityOptions = [
    {value: 'high', label: '🔥 High Priority'},
    {value: 'medium', label: '⚡ Medium Priority'},
    {value: 'low', label: '🌱 Low Priority'},
  ];

  const hasActiveFilters =
    searchText || selectedTags.length > 0 || selectedPriority;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Search Tickets
          </label>
          <input
            type="text"
            id="search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search by ticket name or description..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Priority Filter */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Priority
          </label>
          <button
            type="button"
            onClick={() => setIsPriorityDropdownOpen(!isPriorityDropdownOpen)}
            className="w-full lg:w-48 px-3 py-2 border border-gray-300 rounded-md bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {selectedPriority
              ? priorityOptions.find((p) => p.value === selectedPriority)?.label
              : 'All Priorities'}
          </button>

          {isPriorityDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full lg:w-48 bg-white border border-gray-300 rounded-md shadow-lg">
              <div className="py-1">
                <button
                  onClick={() => handlePriorityChange(null)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                >
                  📋 All Priorities
                </button>
                {priorityOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      handlePriorityChange(
                        option.value as 'low' | 'medium' | 'high',
                      )
                    }
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tag Filter */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <button
            type="button"
            onClick={() => setIsTagDropdownOpen(!isTagDropdownOpen)}
            className="w-full lg:w-48 px-3 py-2 border border-gray-300 rounded-md bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {selectedTags.length === 0
              ? 'Select tags...'
              : `${selectedTags.length} tag${
                  selectedTags.length === 1 ? '' : 's'
                } selected`}
          </button>

          {isTagDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full lg:w-48 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              {availableTags.map((tag) => (
                <label
                  key={tag}
                  className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(tag)}
                    onChange={() => handleTagToggle(tag)}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">{tag}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <div className="flex items-end">
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {searchText && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Search: &quot;{searchText}&quot;
                <button
                  onClick={() => setSearchText('')}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {selectedPriority && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Priority:{' '}
                {
                  priorityOptions.find((p) => p.value === selectedPriority)
                    ?.label
                }
                <button
                  onClick={() => setSelectedPriority(null)}
                  className="ml-1 text-purple-600 hover:text-purple-800"
                >
                  ×
                </button>
              </span>
            )}
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
              >
                {tag}
                <button
                  onClick={() => handleTagToggle(tag)}
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
