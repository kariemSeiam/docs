import { AlertCircle, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function DemoNotice() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has dismissed the notice before
    const dismissed = localStorage.getItem('demo-notice-dismissed')
    if (!dismissed) {
      setIsVisible(true)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem('demo-notice-dismissed', 'true')
  }

  if (!isVisible) return null

  return (
    <Card className="mb-6 border-yellow-500/50 bg-yellow-50/50 dark:bg-yellow-950/20">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-sm mb-1">Demo Version</h3>
            <p className="text-sm text-muted-foreground">
              This is a demo version using mock data. For real transcript extraction, 
              a backend service is required due to CORS restrictions. Check the{' '}
              <a 
                href="https://github.com" 
                className="underline hover:text-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub repository
              </a>{' '}
              for implementation details.
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}