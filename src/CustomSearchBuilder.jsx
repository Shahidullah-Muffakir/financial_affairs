import React, { useState, useEffect, useRef } from 'react';

import './shahid.css';
import { FIELD_MAPPINGS } from './searchConfig';

const CONDITIONS = [
  { value: '=', label: 'Equals' },
  { value: '!=', label: 'Not' },
  { value: 'starts', label: 'Starts With' },
  { value: '!starts', label: 'Does Not Start With' },
  { value: 'contains', label: 'Contains' },
  { value: '!contains', label: 'Does Not Contain' },
  { value: 'ends', label: 'Ends With' },
  { value: '!ends', label: 'Does Not End With' },
  { value: 'null', label: 'Empty' },
  { value: '!null', label: 'Not Empty' },
];

const FIELD_TYPES = {
  text: ['equals', 'contains', 'startsWith', 'endsWith', 'isNull', 'isNotNull'],
  number: ['equals', 'greaterThan', 'lessThan', 'between', 'isNull', 'isNotNull'],
  date: ['equals', 'greaterThan', 'lessThan', 'between', 'isNull', 'isNotNull']
};

const firstField = Object.keys(FIELD_MAPPINGS)[0];
const firstCondition = CONDITIONS[0].value;

const CustomSearchBuilder = ({ onSearchChange, availableValues }) => {
  const [conditions, setConditions] = useState([{
    id: 1,
    field: '',
    condition: '',
    value: '',
    logic: 'AND',
    subConditions: []
  }]);

  useEffect(() => {
    if (onSearchChange) onSearchChange(conditions);
  }, [conditions, onSearchChange]);

  const handleFieldChange = (conditionId, field) => {
    setConditions(prev => prev.map(cond => {
      if (cond.id === conditionId) {
        return {
          ...cond,
          field,
          condition: '',
          value: ''
        };
      }
      return cond;
    }));
  };

  const handleConditionChange = (conditionId, condition) => {
    setConditions(prev => prev.map(cond => {
      if (cond.id === conditionId) {
        return {
          ...cond,
          condition,
          value: ''
        };
      }
      return cond;
    }));
  };

  const handleValueChange = (conditionId, value) => {
    setConditions(prev => prev.map(cond => {
      if (cond.id === conditionId) {
        return {
          ...cond,
          value
        };
      }
      return cond;
    }));
  };

  const handleLogicToggle = (conditionId) => {
    setConditions(prev => prev.map(cond => {
      if (cond.id === conditionId) {
        return {
          ...cond,
          logic: cond.logic === 'AND' ? 'OR' : 'AND'
        };
      }
      return cond;
    }));
  };

  const addCondition = (parentId = null) => {
    const newCondition = {
      id: Date.now() + Math.random(),
      field: '',
      condition: '',
      value: '',
      logic: 'AND',
      subConditions: []
    };
    if (parentId) {
      setConditions(prev => prev.map(cond => {
        if (cond.id === parentId) {
          return {
            ...cond,
            subConditions: [...cond.subConditions, newCondition]
          };
        }
        return cond;
      }));
    } else {
      setConditions(prev => [...prev, newCondition]);
    }
  };

  const removeCondition = (conditionId, parentId = null) => {
    if (parentId) {
      setConditions(prev => prev.map(cond => {
        if (cond.id === parentId) {
          return {
            ...cond,
            subConditions: cond.subConditions.filter(c => c.id !== conditionId)
          };
        }
        return cond;
      }));
    } else {
      setConditions(prev => prev.filter(c => c.id !== conditionId));
    }
  };

  // Helper to find parent and index of a condition by id
  const findParentAndIndex = (conds, id, parent = null) => {
    for (let i = 0; i < conds.length; i++) {
      if (conds[i].id === id) return { parent, index: i, conds };
      if (conds[i].subConditions.length > 0) {
        const found = findParentAndIndex(conds[i].subConditions, id, conds[i]);
        if (found) return found;
      }
    }
    return null;
  };

  // Move left: out of parent
  const moveLeft = (id) => {
    setConditions(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      const found = findParentAndIndex(copy, id);
      if (!found || !found.parent) return prev; // can't move left if no parent
      // Remove from parent's subConditions
      const removed = found.conds.splice(found.index, 1)[0];
      // Insert after parent in its parent's array
      const parentFound = findParentAndIndex(copy, found.parent.id);
      if (!parentFound) return prev;
      parentFound.conds.splice(parentFound.index + 1, 0, removed);
      return copy;
    });
  };

  // Move right: into previous sibling's subConditions
  const moveRight = (id) => {
    setConditions(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      const found = findParentAndIndex(copy, id);
      if (!found) return prev;
      if (found.index === 0) return prev; // can't move right if first
      const prevSibling = found.conds[found.index - 1];
      if (!prevSibling) return prev;
      // Ensure subConditions is always an array
      if (!Array.isArray(prevSibling.subConditions)) {
        prevSibling.subConditions = [];
      }
      // Remove from current position
      const removed = found.conds.splice(found.index, 1)[0];
      // Add to previous sibling's subConditions
      prevSibling.subConditions.push(removed);
      return copy;
    });
  };

  // Add logic to toggle group logic
  const handleGroupLogicToggle = (parentId) => {
    setConditions(prev => {
      const toggleLogic = (conds, id) => {
        if (id === null) {
          // top-level
          return conds.map((c, i) => ({ ...c, logic: conds[0].logic === 'AND' ? 'OR' : 'AND' }));
        }
        return conds.map(cond => {
          if (cond.id === id) {
            return {
              ...cond,
              subConditions: cond.subConditions.map((c, i) => ({ ...c, logic: cond.subConditions[0]?.logic === 'AND' ? 'OR' : 'AND' }))
            };
          } else if (cond.subConditions.length > 0) {
            return { ...cond, subConditions: toggleLogic(cond.subConditions, id) };
          }
          return cond;
        });
      };
      return toggleLogic(prev, parentId);
    });
  };

  const getGroupLogic = (conds) => conds[0]?.logic || 'AND';

  // Recursive function to count all conditions
  const countAllConditions = (conds) =>
    conds.reduce((acc, cond) => acc + 1 + countAllConditions(cond.subConditions), 0);

  const renderCondition = (condition, parentId = null, parentConds = conditions) => {
    const fieldConfig = FIELD_MAPPINGS[condition.field] || { type: 'text' };
    const showValueInput = !['null', '!null'].includes(condition.condition);
    const showSelectValue = showValueInput && availableValues && availableValues[condition.field] && ['=', '!='].includes(condition.condition);
    // Find index in parent
    const idx = parentConds.findIndex(c => c.id === condition.id);
    return (
      <div key={condition.id} className="dtsb-criteria">
        <select
          className="dtsb-data dtsb-dropDown dtsb-italic"
          value={condition.field || ''}
          onChange={e => handleFieldChange(condition.id, e.target.value)}
        >
          <option value="" disabled>Data</option>
          {Object.keys(FIELD_MAPPINGS).map(field => (
            <option key={field} value={field}>{field}</option>
          ))}
        </select>
        <select
          className="dtsb-condition dtsb-dropDown dtsb-italic"
          autoComplete="hacking"
          value={condition.condition || ''}
          onChange={e => handleConditionChange(condition.id, e.target.value)}
          disabled={!condition.field}
        >
          <option value="" disabled>Condition</option>
          {CONDITIONS.map(opt => (
            <option key={opt.value} value={opt.value} className="dtsb-option dtsb-notItalic">{opt.label}</option>
          ))}
        </select>
        <div className="dtsb-inputCont">
          {showValueInput ? (
            showSelectValue ? (
              <select
                className="dtsb-value dtsb-dropDown dtsb-italic dtsb-select"
                value={condition.value || ''}
                onChange={e => handleValueChange(condition.id, e.target.value)}
                disabled={!condition.condition}
                key={condition.id + '-select'}
              >
                <option value="" disabled>Value</option>
                {availableValues[condition.field]?.map(val => (
                  <option key={val} value={val}>{val}</option>
                ))}
              </select>
            ) : (
              <input
                className="dtsb-value dtsb-dropDown dtsb-italic dtsb-select"
                value={condition.value}
                onChange={e => handleValueChange(condition.id, e.target.value)}
                placeholder="Value"
                type={fieldConfig.type === 'date' ? 'date' : 'text'}
                disabled={!condition.condition}
                key={condition.id + '-input'}
              />
            )
          ) : (
            <input
              className="dtsb-value dtsb-dropDown dtsb-italic dtsb-select"
              value=""
              placeholder="Value"
              disabled
              key={condition.id + '-empty'}
            />
          )}
        </div>
        <div className="dtsb-buttonContainer" style={{ display: 'flex', gap: 4 }}>
          {/* Move left button: only if has parent */}
          {parentId && (
            <button
              className="dtsb-move-left dtsb-button"
              type="button"
              title="Move out"
              onClick={() => moveLeft(condition.id)}
            >&lt;</button>
          )}
          {/* Move right button: only if not first in parent */}
          {idx > 0 && (
            <button
              className="dtsb-move-right dtsb-button"
              type="button"
              title="Move in"
              onClick={() => moveRight(condition.id)}
            >&gt;</button>
          )}
          <button
            className="dtsb-delete dtsb-button"
            onClick={() => removeCondition(condition.id, parentId)}
            type="button"
            title="Delete filtering rule"
          >
            ×
          </button>
        </div>
      </div>
    );
  };

  // New component for group rendering
  const ConditionGroup = ({ conds, parentId }) => {
    const groupRef = useRef(null);
    const [groupHeight, setGroupHeight] = useState(null);

    useEffect(() => {
      if (groupRef.current) {
        setGroupHeight(groupRef.current.offsetHeight);
      }
    }, [conds.length, conds.map(c => c.id).join(','), conds.map(c => c.subConditions.length).join(',')]);

    if (conds.length === 0) {
      // Show only the Add Condition button if no conditions
      return (
        <div style={{ marginLeft: 8 }}>
          <button
            className="dtsb-add dtsb-button"
            onClick={() => addCondition(parentId)}
            type="button"
          >
            Add Condition
          </button>
        </div>
      );
    }

    return (
      <div className="dtsb-group" style={{ display: 'flex', alignItems: 'flex-start' }}>
        {/* Vertical logic button */}
        {conds.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: 8 }}>
            <button
              className="dtsb-logic dtsb-button"
              style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', height: groupHeight ? groupHeight : '60px', minHeight: 60 }}
              onClick={() => handleGroupLogicToggle(parentId)}
              type="button"
            >
              {getGroupLogic(conds)}
            </button>
          </div>
        )}
        <div style={{ flex: 1 }} ref={groupRef}>
          {conds.map((condition) => (
            <React.Fragment key={condition.id}>
              {renderCondition(condition, parentId, conds)}
              {condition.subConditions.length > 0 && (
                <div className="dtsb-subConditions">
                  <ConditionGroup conds={condition.subConditions} parentId={condition.id} />
                </div>
              )}
            </React.Fragment>
          ))}
          <button
            className="dtsb-add dtsb-button"
            onClick={() => addCondition(parentId)}
            type="button"
          >
            Add Condition
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="dtsb-searchBuilder">
      <div className="dtsb-titleRow">
        <div className="dtsb-title">Custom Search Builder ({countAllConditions(conditions)})</div>
        <button
          type="button"
          className="dtsb-clearAll dtsb-button"
          onClick={() => setConditions([])}
        >
          Clear All
        </button>
      </div>
      <ConditionGroup conds={conditions} parentId={null} />
    </div>
  );
};

export default CustomSearchBuilder;
