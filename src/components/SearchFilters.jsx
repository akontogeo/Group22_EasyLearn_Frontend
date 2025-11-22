import React, { useState } from 'react';
import { CATEGORIES, DIFFICULTY_LEVELS } from '../utils/constants';

export default function SearchFilters({onApply}){
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    Premium: ''
  });

  const handleChange = (e) => {
    setFilters({...filters, [e.target.name]: e.target.value});
  };

  const apply = () => {
    const params = {};
    if(filters.category) params.category = filters.category;
    if(filters.difficulty) params.difficulty = filters.difficulty;
    if(filters.Premium !== '') params.Premium = filters.Premium === 'true';
    onApply(params);
  };

  return (
    <aside>
      <div className="card" style={{padding:16}}>
        <h4>Filters</h4>
        <div>
          <label>Category</label>
          <select name="category" value={filters.category} onChange={handleChange} style={{width:'100%'}}>
            <option value="">All</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div style={{marginTop:12}}>
          <label>Difficulty</label>
          <select name="difficulty" value={filters.difficulty} onChange={handleChange} style={{width:'100%'}}>
            <option value="">All</option>
            {DIFFICULTY_LEVELS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div style={{marginTop:12}}>
          <label>Premium</label>
          <select name="Premium" value={filters.Premium} onChange={handleChange} style={{width:'100%'}}>
            <option value="">All</option>
            <option value="false">Free</option>
            <option value="true">Premium</option>
          </select>
        </div>
        <div style={{marginTop:12}}>
          <button className="btn" onClick={apply}>Apply</button>
        </div>
      </div>
    </aside>
  )
}
