'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loader2, Sparkles, Info } from 'lucide-react'
import { suggestRating } from '@/app/actions/llm.actions'
import { toast } from 'sonner'

interface AISuggestionBadgeProps {
  criteriaName: string
  employeeNarrative: string
  experienceLevel: string
  onRatingSelect?: (rating: number) => void
}

export function AISuggestionBadge({
  criteriaName,
  employeeNarrative,
  experienceLevel,
  onRatingSelect
}: AISuggestionBadgeProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [suggestion, setSuggestion] = useState<{
    rating: number
    justification: string
  } | null>(null)
  const [showJustification, setShowJustification] = useState(false)

  const handleAnalyze = async () => {
    if (!employeeNarrative.trim()) {
      toast.error('No narrative to analyze')
      return
    }

    setIsLoading(true)
    try {
      const result = await suggestRating({
        employee_narrative: employeeNarrative,
        criterion_name: criteriaName,
        experience_level: experienceLevel
      })

      if (result.error) {
        toast.error(result.error)
      } else {
        setSuggestion({
          rating: result.suggested_rating,
          justification: result.llm_justification
        })
        toast.success('AI analysis complete')
      }
    } catch (error) {
      toast.error('Failed to analyze narrative')
      console.error('AI suggestion error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApplySuggestion = () => {
    if (suggestion && onRatingSelect) {
      onRatingSelect(suggestion.rating)
      toast.success(`Applied suggested rating: ${suggestion.rating}/5`)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAnalyze}
          disabled={isLoading}
          className="text-xs"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="h-3 w-3 mr-1" />
              AI Suggest
            </>
          )}
        </Button>

        {suggestion && !isLoading && (
          <div className="flex items-center gap-2">
            <Badge 
              variant="secondary" 
              className="cursor-pointer hover:bg-secondary/80 transition-colors"
              onClick={() => setShowJustification(!showJustification)}
            >
              <Sparkles className="h-3 w-3 mr-1" />
              Suggested: {suggestion.rating}/5
              <Info className="h-3 w-3 ml-1" />
            </Badge>
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleApplySuggestion}
              className="text-xs h-7 px-2"
            >
              Apply
            </Button>
          </div>
        )}
      </div>

      {suggestion && showJustification && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-xs">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-blue-900 mb-1">AI Analysis:</p>
              <p className="text-blue-800">{suggestion.justification}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}