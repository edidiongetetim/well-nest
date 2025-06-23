
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { EnhancedAddReminderDialog } from "./EnhancedAddReminderDialog";
import { ViewAllRemindersDialog } from "./ViewAllRemindersDialog";

interface Reminder {
  id: string;
  title: string;
  description?: string;
  reminder_date: string;
  reminder_time?: string;
}

export function EnhancedReminderCard() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [todaysDate, setTodaysDate] = useState("");

  useEffect(() => {
    const now = new Date();
    setTodaysDate(format(now, "EEEE, MMMM do, yyyy"));
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: remindersData } = await supabase
        .from('reminders')
        .select('*')
        .eq('user_id', user.id)
        .order('reminder_date', { ascending: true });
      
      if (remindersData) {
        setReminders(remindersData);
      }
    }
  };

  const getNextReminder = () => {
    const today = new Date();
    return reminders.find(reminder => new Date(reminder.reminder_date) >= today);
  };

  const nextReminder = getNextReminder();

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-100">
      <CardContent className="p-6">
        {reminders.length === 0 ? (
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Calendar className="w-12 h-12 text-primary" />
            </div>
            <h3 className="font-poppins font-semibold text-gray-900 mb-2">
              Today is: {todaysDate}
            </h3>
            <p className="font-poppins text-sm text-gray-600 mb-4">
              You don't have any reminders today
            </p>
            <EnhancedAddReminderDialog onReminderAdded={fetchReminders} />
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center relative">
                <Calendar className="w-8 h-8 text-primary" />
                {nextReminder && (
                  <div className="absolute bottom-1 right-1 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center">
                    <span className="text-xs font-bold font-poppins">
                      {format(new Date(nextReminder.reminder_date), 'd')}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                {nextReminder ? (
                  <>
                    <h3 className="font-poppins font-semibold text-gray-900 mb-1">
                      {nextReminder.title}
                    </h3>
                    <p className="font-poppins text-sm text-gray-600 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(nextReminder.reminder_date), 'MMM do, yyyy')}
                      {nextReminder.reminder_time && (
                        <>
                          <Clock className="w-4 h-4 ml-2" />
                          {nextReminder.reminder_time}
                        </>
                      )}
                    </p>
                    {nextReminder.description && (
                      <p className="font-poppins text-xs text-gray-500 mt-1">
                        {nextReminder.description}
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <h3 className="font-poppins font-semibold text-gray-900 mb-1">
                      No upcoming reminders
                    </h3>
                    <p className="font-poppins text-sm text-gray-600">
                      All your reminders are in the past
                    </p>
                  </>
                )}
                <ViewAllRemindersDialog onReminderUpdated={fetchReminders}>
                  <button className="font-poppins text-sm text-primary hover:underline mt-2">
                    View All Reminders ({reminders.length})
                  </button>
                </ViewAllRemindersDialog>
              </div>
            </div>
            <EnhancedAddReminderDialog onReminderAdded={fetchReminders} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
