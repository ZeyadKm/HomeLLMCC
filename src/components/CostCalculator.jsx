import React, { useState } from 'react';
import { DollarSign, Plus, Calculator } from 'lucide-react';

export default function CostCalculator({ onTotalChange }) {
  const [costs, setCosts] = useState({
    repairCost: 0,
    medicalCost: 0,
    lostWages: 0,
    propertyDamage: 0,
    temporaryHousing: 0,
    other: 0
  });

  const [customItems, setCustomItems] = useState([]);

  const handleCostChange = (field, value) => {
    const numValue = parseFloat(value) || 0;
    const newCosts = { ...costs, [field]: numValue };
    setCosts(newCosts);

    // Calculate total and notify parent
    const total = Object.values(newCosts).reduce((sum, val) => sum + val, 0) +
                  customItems.reduce((sum, item) => sum + (item.amount || 0), 0);
    if (onTotalChange) {
      onTotalChange(total);
    }
  };

  const addCustomItem = () => {
    setCustomItems([...customItems, { description: '', amount: 0 }]);
  };

  const updateCustomItem = (index, field, value) => {
    const newItems = [...customItems];
    newItems[index][field] = field === 'amount' ? (parseFloat(value) || 0) : value;
    setCustomItems(newItems);

    const total = Object.values(costs).reduce((sum, val) => sum + val, 0) +
                  newItems.reduce((sum, item) => sum + (item.amount || 0), 0);
    if (onTotalChange) {
      onTotalChange(total);
    }
  };

  const removeCustomItem = (index) => {
    const newItems = customItems.filter((_, i) => i !== index);
    setCustomItems(newItems);

    const total = Object.values(costs).reduce((sum, val) => sum + val, 0) +
                  newItems.reduce((sum, item) => sum + (item.amount || 0), 0);
    if (onTotalChange) {
      onTotalChange(total);
    }
  };

  const totalCost = Object.values(costs).reduce((sum, val) => sum + val, 0) +
                    customItems.reduce((sum, item) => sum + (item.amount || 0), 0);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6 dark:text-white">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="w-6 h-6 text-headspace-orange dark:text-headspace-orange" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Damage & Cost Calculator</h2>
      </div>

      <div className="bg-white dark:bg-dark-bg-secondary rounded-xl p-6 shadow-lg border border-gray-200 dark:border-dark-border">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
              Estimated Repair Cost
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                value={costs.repairCost || ''}
                onChange={(e) => handleCostChange('repairCost', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-headspace-orange focus:border-transparent dark:bg-dark-bg-tertiary dark:text-white"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
              Medical Expenses
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                value={costs.medicalCost || ''}
                onChange={(e) => handleCostChange('medicalCost', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-headspace-orange focus:border-transparent dark:bg-dark-bg-tertiary dark:text-white"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
              Lost Wages/Work
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                value={costs.lostWages || ''}
                onChange={(e) => handleCostChange('lostWages', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-headspace-orange focus:border-transparent dark:bg-dark-bg-tertiary dark:text-white"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
              Property Damage
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                value={costs.propertyDamage || ''}
                onChange={(e) => handleCostChange('propertyDamage', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-headspace-orange focus:border-transparent dark:bg-dark-bg-tertiary dark:text-white"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
              Temporary Housing
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                value={costs.temporaryHousing || ''}
                onChange={(e) => handleCostChange('temporaryHousing', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-headspace-orange focus:border-transparent dark:bg-dark-bg-tertiary dark:text-white"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
              Other Costs
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                value={costs.other || ''}
                onChange={(e) => handleCostChange('other', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-headspace-orange focus:border-transparent dark:bg-dark-bg-tertiary dark:text-white"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </div>

        {/* Custom Items */}
        {customItems.length > 0 && (
          <div className="mt-4 space-y-2">
            <h3 className="font-medium text-gray-700 dark:text-dark-text">Custom Items</h3>
            {customItems.map((item, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => updateCustomItem(index, 'description', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-headspace-orange focus:border-transparent dark:bg-dark-bg-tertiary dark:text-white"
                  placeholder="Description"
                />
                <div className="relative w-40">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    value={item.amount || ''}
                    onChange={(e) => updateCustomItem(index, 'amount', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-headspace-orange focus:border-transparent dark:bg-dark-bg-tertiary dark:text-white"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
                <button
                  onClick={() => removeCustomItem(index)}
                  className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={addCustomItem}
          className="mt-4 flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-dark-bg-tertiary text-gray-700 dark:text-dark-text rounded-lg hover:bg-gray-200 dark:hover:bg-dark-bg"
        >
          <Plus className="w-4 h-4" />
          Add Custom Item
        </button>

        {/* Total */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-dark-border">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-800 dark:text-white">Total Estimated Damages:</span>
            <span className="text-3xl font-bold text-headspace-orange dark:text-headspace-orange">
              {formatCurrency(totalCost)}
            </span>
          </div>
        </div>

        {/* Export Summary */}
        <div className="mt-4 p-4 bg-gray-50 dark:bg-dark-bg rounded-lg">
          <h4 className="font-medium text-gray-700 dark:text-dark-text mb-2">Cost Breakdown Summary</h4>
          <div className="text-sm text-gray-600 dark:text-dark-text-secondary space-y-1">
            {costs.repairCost > 0 && <div>Repair Cost: {formatCurrency(costs.repairCost)}</div>}
            {costs.medicalCost > 0 && <div>Medical Expenses: {formatCurrency(costs.medicalCost)}</div>}
            {costs.lostWages > 0 && <div>Lost Wages: {formatCurrency(costs.lostWages)}</div>}
            {costs.propertyDamage > 0 && <div>Property Damage: {formatCurrency(costs.propertyDamage)}</div>}
            {costs.temporaryHousing > 0 && <div>Temporary Housing: {formatCurrency(costs.temporaryHousing)}</div>}
            {costs.other > 0 && <div>Other Costs: {formatCurrency(costs.other)}</div>}
            {customItems.map((item, i) => (
              item.amount > 0 && <div key={i}>{item.description}: {formatCurrency(item.amount)}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
