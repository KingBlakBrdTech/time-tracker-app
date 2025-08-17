import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, Calendar, BarChart3, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";

export default function QuickActions({ onRefresh }) {
  const actions = [
    {
      title: "View Timesheet",
      description: "See your complete work history",
      icon: Calendar,
      link: createPageUrl("Timesheet"),
      color: "from-blue-500 to-indigo-500"
    }
  ];

  return (
    <Card className="bg-white/60 backdrop-blur-sm border border-slate-200">
      <CardHeader>
        <CardTitle className="text-xl text-slate-900">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {actions.map((action, index) => (
            <motion.div
              key={action.title}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to={action.link}>
                <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 bg-white border-0">
                  <CardContent className="p-6 text-center">
                    <div className={`w-12 h-12 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${action.color} flex items-center justify-center`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">{action.title}</h3>
                    <p className="text-sm text-slate-600">{action.description}</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 bg-white border-0">
              <CardContent className="p-6 text-center">
                <Button
                  onClick={onRefresh}
                  variant="ghost"
                  className="w-full h-full p-0 hover:bg-transparent"
                >
                  <div>
                    <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                      <RefreshCw className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">Refresh Data</h3>
                    <p className="text-sm text-slate-600">Update your current status</p>
                  </div>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );