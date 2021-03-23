import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Show from './../Show';

const testShow = {
    //add in approprate test data structure here.
    name: "Person of Interest",
    summary: "You are being watched. The government has a secret system, a machine that spies on you every hour of every day. I know because I built it. I designed the Machine to detect acts of terror but it sees everything. Violent crimes involving ordinary people. People like you. Crimes the government considered \"irrelevant\". They wouldn't act so I decided I would. But I needed a partner. Someone with the skills to intervene. Hunted by the authorities, we work in secret. You'll never find us. But victim or perpetrator, if your number is up, we'll find you.",
    seasons: [
        {id: 0, name: 'Season 1', episodes: []}, 
        {id: 1, name: 'Season 2', episodes: []}, 
        {id: 2, name: 'Season 3', episodes: []}, 
        {id: 3, name: 'Season 4', episodes: []},
        {id: 4, name: 'Season 5', episodes: []},
    ],
}

test('renders testShow and no selected Season without errors', ()=>{
    render(<Show show={testShow} selectedSeason={'none'} />);
});

test('renders Loading component when prop show is null', () => {
    // --- ARRANGE ---
    // Render Show component with no show data, no selected season
    render(<Show show={null} selectedSeason={'none'} />);

    // --- ACT ---
    // Get loading message element
    const loading = screen.getByTestId('loading-container');

    // --- ASSERT ---
    // Check that loading message is in the document and has expected text content
    expect(loading).toBeInTheDocument();
    expect(loading).toHaveTextContent(/fetching data.../i);
});

test('renders same number of options seasons are passed in', ()=>{
    // --- ARRANGE ---
    // Render Show component with test data, no selected season
    render(<Show show={testShow} selectedSeason={'none'} />);

    // --- ACT ---
    // Get season <option> elements
    const seasonOptions = screen.queryAllByTestId('season-option');

    // --- ASSERT ---
    // Check that seasonOption is not null and has the
    // same length as test data seasons array length
    expect(seasonOptions).not.toBeNull();
    expect(seasonOptions).toHaveLength(testShow.seasons.length);
});

test('handleSelect is called when an season is selected', () => {
    // Create mock function to replace handleSelect
    const mockHandleSelect = jest.fn();
    
    // --- ARRANGE ---
    // Render Show component with test data, no selected season, and mock function
    render(<Show show={testShow} selectedSeason={'none'} handleSelect={mockHandleSelect} />);

    // --- ACT ---
    // Get season <select> and <option> elements
    const seasonSelect = screen.getByLabelText(/select a season/i);
    const seasonOptions = screen.queryAllByTestId('season-option');

    // Select first <option> element
    userEvent.selectOptions(seasonSelect, seasonOptions[0]);


    // --- ASSERT ---
    // Check that first <option> element is selected and all other <option> elements are not
    expect(seasonOptions[0].selected).toBeTruthy();
    expect(seasonOptions[1].selected).toBeFalsy();
    expect(seasonOptions[2].selected).toBeFalsy();
    expect(seasonOptions[3].selected).toBeFalsy();
    expect(seasonOptions[4].selected).toBeFalsy();

    // Check that mock handleSelect function was called, and was only called once
    expect(mockHandleSelect).toHaveBeenCalled();
    expect(mockHandleSelect.mock.calls.length).toBe(1);
});

test('component renders when no seasons are selected and when rerenders with a season passed in', () => {
    // --- ARRANGE (1) ---
    // Render Show component with test data, no selected season, and destructure rerender function
    const { rerender } = render(<Show show={testShow} selectedSeason={'none'} />);
    
    // --- ACT (1) ---
    // Query episodes container element
    let episodesContainer = screen.queryByTestId('episodes-container');

    // --- ASSERT (1) ---
    // Check that episodes container is /NOT/ in the document
    expect(episodesContainer).not.toBeInTheDocument();

    // --- ARRANGE (2) ---
    // Rerender Show component with test data, selected season of 0
    rerender(<Show show={testShow} selectedSeason={0} />);

    // --- ACT (2) ---
    // Query episodes container element and reassign
    episodesContainer = screen.queryByTestId('episodes-container');

    // --- ASSERT (2) ---
    // Check that episodes container now /IS/ in the document
    expect(episodesContainer).toBeInTheDocument();
});



//Tasks:
//1. Build an example data structure that contains the show data in the correct format. A show should contain a name, a summary and an array of seasons, each with a id, name and (empty) list of episodes within them. Use console.logs within the client code if you need to to verify the structure of show data.
//2. Test that the Show component renders when your test data is passed in through show and "none" is passed in through selectedSeason.
//3. Test that the Loading component displays when null is passed into the show prop (look at the Loading component to see how to test for it's existance)
//4. Test that when your test data is passed through the show prop, the same number of season select options appears as there are seasons in your test data.
//5. Test that when an item is selected, the handleSelect function is called. Look at your code to see how to get access to the select Dom element and userEvent reference materials to see how to trigger a selection.
//6. Test that the episode component DOES NOT render when the selectedSeason props is "none" and DOES render the episode component when the selectedSeason prop has a valid season index.