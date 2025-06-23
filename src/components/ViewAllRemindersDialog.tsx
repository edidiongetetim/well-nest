
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock, Trash2, Edit, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Reminder {
  id: string;
  title: string;
  description?: string;
  reminder_date: string;
  reminder_time?: string;
}

interface ViewAllRemindersDialogProps {
  children: React.ReactNode;
  onReminderUpdated: () => void;
}

export function ViewAllRemindersDialog({ children, onReminderUpdated }: ViewAllRemindersDialogProps) {
  const [open, setOpen] = useState(false);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDate, setEditDate] = useState<Date | undefined>(undefined);
  const [editTime, setEditTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchReminders();
    }
  }, [open]);

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

  const handleDeleteReminder = async (reminderId: string) => {
    try {
      const { error } = await supabase
        .from('reminders')
        .delete()
        .eq('id', reminderId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Reminder deleted successfully!",
      });

      fetchReminders();
      onReminderUpdated();
    } catch (error) {
      console.error("Error deleting reminder:", error);
      toast({
        title: "Error",
        description: "Failed to delete reminder. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditReminder = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setEditTitle(reminder.title);
    setEditDescription(reminder.description || "");
    setEditDate(new Date(reminder.reminder_date));
    setEditTime(reminder.reminder_time || "");
  };

  const handleSaveEdit = async () => {
    if (!editingReminder || !editTitle || !editDate) {
      toast({
        title: "Error",
        description: "Please fill in title and date fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('reminders')
        .update({
          title: editTitle,
          description: editDescription,
          reminder_date: format(editDate, 'yyyy-MM-dd'),
          reminder_time: editTime || null,
        })
        .eq('id', editingReminder.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Reminder updated successfully!",
      });

      setEditingReminder(null);
      fetchReminders();
      onReminderUpdated();
    } catch (error) {
      console.error("Error updating reminder:", error);
      toast({
        title: "Error",
        description: "Failed to update reminder. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingReminder(null);
    setEditTitle("");
    setEditDescription("");
    setEditDate(undefined);
    setEditTime("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-white max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-poppins text-xl text-primary">All Reminders</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {reminders.length === 0 ? (
            <div className="text-center py-8">
              <p className="font-poppins text-gray-600">No reminders found</p>
            </div>
          ) : (
            reminders.map((reminder) => (
              <div key={reminder.id} className="border border-gray-200 rounded-lg p-4">
                {editingReminder?.id === reminder.id ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-title" className="font-poppins font-medium">Title *</Label>
                      <Input
                        id="edit-title"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Enter reminder title"
                        className="font-poppins"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="edit-description" className="font-poppins font-medium">Description</Label>
                      <Textarea
                        id="edit-description"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        placeholder="Enter reminder description (optional)"
                        className="font-poppins"
                        rows={2}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="font-poppins font-medium">Date *</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-poppins",
                                !editDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {editDate ? format(editDate, "MMM do, yyyy") : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 bg-white border border-gray-200" align="start">
                            <Calendar
                              mode="single"
                              selected={editDate}
                              onSelect={setEditDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="edit-time" className="font-poppins font-medium">Time (optional)</Label>
                        <Input
                          id="edit-time"
                          type="time"
                          value={editTime}
                          onChange={(e) => setEditTime(e.target.value)}
                          className="font-poppins"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={handleCancelEdit} className="font-poppins">
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                      <Button onClick={handleSaveEdit} disabled={isLoading} className="font-poppins bg-primary hover:bg-primary/90">
                        {isLoading ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-poppins font-semibold text-gray-900">
                        {reminder.title}
                      </h3>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditReminder(reminder)}
                          className="font-poppins"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteReminder(reminder.id)}
                          className="font-poppins text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 font-poppins mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(reminder.reminder_date), 'MMM do, yyyy')}
                      </div>
                      {reminder.reminder_time && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {reminder.reminder_time}
                        </div>
                      )}
                    </div>
                    
                    {reminder.description && (
                      <p className="font-poppins text-sm text-gray-600">
                        {reminder.description}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
