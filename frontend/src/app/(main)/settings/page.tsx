'use client'

import { useState, useEffect } from 'react'
import { useAppStore } from '@/lib/store'
import { Settings, Sliders, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export default function SettingsPage() {
  const { optimizationWeights, updateOptimizationWeights, addNotification } = useAppStore()
  
  const [timeWeight, setTimeWeight] = useState(optimizationWeights.timeWeight)
  const [costWeight, setCostWeight] = useState(optimizationWeights.costWeight)
  const [emissionsWeight, setEmissionsWeight] = useState(optimizationWeights.emissionsWeight)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    setTimeWeight(optimizationWeights.timeWeight)
    setCostWeight(optimizationWeights.costWeight)
    setEmissionsWeight(optimizationWeights.emissionsWeight)
  }, [optimizationWeights])

  useEffect(() => {
    // Check if there are unsaved changes
    const changed = 
      timeWeight !== optimizationWeights.timeWeight ||
      costWeight !== optimizationWeights.costWeight ||
      emissionsWeight !== optimizationWeights.emissionsWeight
    setHasChanges(changed)
  }, [timeWeight, costWeight, emissionsWeight, optimizationWeights])

  const handleTimeChange = (value: number) => {
    setTimeWeight(value)
  }

  const handleCostChange = (value: number) => {
    setCostWeight(value)
  }

  const handleEmissionsChange = (value: number) => {
    setEmissionsWeight(value)
  }

  const handleSave = () => {
    updateOptimizationWeights({
      timeWeight,
      costWeight,
      emissionsWeight
    })
    addNotification({
      type: 'success',
      message: 'Route optimization preferences saved successfully!'
    })
    setHasChanges(false)
  }

  const handleReset = () => {
    setTimeWeight(35)
    setCostWeight(25)
    setEmissionsWeight(40)
    setHasChanges(true)
  }

  const total = timeWeight + costWeight + emissionsWeight

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-50">
            <Settings className="h-7 w-7 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Route Optimization Settings</h1>
            <p className="text-muted-foreground mt-1">Configure optimization priorities for route planning</p>
          </div>
        </div>
      </div>

      {/* Settings Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <Sliders className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-slate-900">Optimization Weights</h2>
        </div>

        <div className="space-y-8">
          {/* Time Weight */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium text-slate-900">
                ⏱️ Time Priority
              </Label>
              <span className="text-2xl font-bold text-blue-600">{timeWeight}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={timeWeight}
              onChange={(e) => handleTimeChange(parseInt(e.target.value))}
              className="w-full h-3 bg-blue-100 rounded-lg appearance-none cursor-pointer slider-thumb-blue"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${timeWeight}%, #dbeafe ${timeWeight}%, #dbeafe 100%)`
              }}
            />
            <p className="text-sm text-muted-foreground">
              Higher values prioritize faster routes with shorter travel time
            </p>
          </div>

          {/* Cost Weight */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium text-slate-900">
                💰 Cost Priority
              </Label>
              <span className="text-2xl font-bold text-green-600">{costWeight}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={costWeight}
              onChange={(e) => handleCostChange(parseInt(e.target.value))}
              className="w-full h-3 bg-green-100 rounded-lg appearance-none cursor-pointer slider-thumb-green"
              style={{
                background: `linear-gradient(to right, #22c55e 0%, #22c55e ${costWeight}%, #dcfce7 ${costWeight}%, #dcfce7 100%)`
              }}
            />
            <p className="text-sm text-muted-foreground">
              Higher values prioritize cost-effective routes with lower fuel expenses
            </p>
          </div>

          {/* Emissions Weight */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium text-slate-900">
                🌱 Emissions Priority
              </Label>
              <span className="text-2xl font-bold text-emerald-600">{emissionsWeight}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={emissionsWeight}
              onChange={(e) => handleEmissionsChange(parseInt(e.target.value))}
              className="w-full h-3 bg-emerald-100 rounded-lg appearance-none cursor-pointer slider-thumb-emerald"
              style={{
                background: `linear-gradient(to right, #10b981 0%, #10b981 ${emissionsWeight}%, #d1fae5 ${emissionsWeight}%, #d1fae5 100%)`
              }}
            />
            <p className="text-sm text-muted-foreground">
              Higher values prioritize eco-friendly routes with lower CO₂ emissions
            </p>
          </div>

          {/* Total Indicator */}
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-base font-medium text-slate-700">Total Weight:</span>
              <span className="text-2xl font-bold text-blue-600">
                {total}%
              </span>
            </div>
            <p className="text-sm text-slate-600 mt-2">
              ℹ️ Weights can range from 0-100% independently
            </p>
          </div>

          {/* Visual Distribution */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">Weight Distribution:</Label>
            <div className="h-8 rounded-lg overflow-hidden flex">
              <div 
                className="bg-blue-500 flex items-center justify-center text-white text-xs font-medium transition-all"
                style={{ width: `${timeWeight}%` }}
              >
                {timeWeight > 10 && `Time ${timeWeight}%`}
              </div>
              <div 
                className="bg-green-500 flex items-center justify-center text-white text-xs font-medium transition-all"
                style={{ width: `${costWeight}%` }}
              >
                {costWeight > 10 && `Cost ${costWeight}%`}
              </div>
              <div 
                className="bg-emerald-500 flex items-center justify-center text-white text-xs font-medium transition-all"
                style={{ width: `${emissionsWeight}%` }}
              >
                {emissionsWeight > 10 && `Emissions ${emissionsWeight}%`}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-4">
            <Button
              onClick={handleSave}
              disabled={!hasChanges}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Save className="h-4 w-4" />
              Save Preferences
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="flex items-center gap-2"
            >
              Reset to Default
            </Button>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">How it works</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• <strong>Time Priority:</strong> Optimizes for the quickest route considering traffic patterns</li>
          <li>• <strong>Cost Priority:</strong> Finds the most fuel-efficient route to minimize expenses</li>
          <li>• <strong>Emissions Priority:</strong> Chooses routes that reduce carbon footprint and environmental impact</li>
          <li>• Each weight can be set independently from 0% to 100%</li>
          <li>• Higher values give more importance to that particular factor in route selection</li>
          <li>• Changes apply to all future route optimizations until modified again</li>
        </ul>
      </div>

      <style jsx>{`
        .slider-thumb-blue::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider-thumb-green::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #22c55e;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider-thumb-emerald::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .slider-thumb-blue::-moz-range-thumb,
        .slider-thumb-green::-moz-range-thumb,
        .slider-thumb-emerald::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider-thumb-blue::-moz-range-thumb {
          background: #3b82f6;
        }
        
        .slider-thumb-green::-moz-range-thumb {
          background: #22c55e;
        }
        
        .slider-thumb-emerald::-moz-range-thumb {
          background: #10b981;
        }
      `}</style>
    </div>
  )
}
