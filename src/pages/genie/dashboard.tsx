
import { Card, CardContent } from '@/ui/components/Card';
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"

import data from "@/data/dashboard-data.json"

export function GenieDashboard() {

  return (
    <>
    {/* Quick Actions */}
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Onboarding Checklist</h3>
            <div className="space-y-4">
              {/* Analytics - Completed */}
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <span className="text-gray-500 line-through">Analytics Connected</span>
              </div>
              
              {/* Calendly - Pending */}
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  </div>
                </div>
                <button className="text-left hover:text-emerald-600 transition-colors">
                  <span className="font-medium">Connect Calendly</span>
                </button>
              </div>
              
              {/* YouMail - Pending */}
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  </div>
                </div>
                <button className="text-left hover:text-emerald-600 transition-colors">
                  <span className="font-medium">Connect YouMail</span>
                </button>
              </div>
              
              {/* Instagram - Pending */}
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  </div>
                </div>
                <button className="text-left hover:text-emerald-600 transition-colors">
                  <span className="font-medium">Connect Instagram Account</span>
                </button>
              </div>
              
              {/* WhatsApp - Pending */}
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  </div>
                </div>
                <button className="text-left hover:text-emerald-600 transition-colors">
                  <span className="font-medium">Connect WhatsApp Account</span>
                </button>
              </div>
            </div>
            
            {/* Progress indicator */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium text-emerald-600">1/5 Complete</span>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full" style={{width: '20%'}}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-gray-600">Genie "LeadBot" generated 23 new leads</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">Training session completed for "SupportBot"</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-600">Playground experiment "EmailBot" ready</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

    <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6"></div>
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <DataTable data={data} />
      </div>
      </div>

    </>
  )
}
