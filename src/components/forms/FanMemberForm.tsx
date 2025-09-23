import { useState } from "react";
import { applicationsAPI } from '@/services/api';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Upload, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const fanMemberSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(8, "Phone number must be at least 8 digits"),
  whyJoin: z.string().min(10, "Please tell us why you want to join (minimum 10 characters)"),
  photo: z.any().optional()
});

type FanMemberFormData = z.infer<typeof fanMemberSchema>;

const FanMemberForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const { toast } = useToast();

  const form = useForm<FanMemberFormData>({
    resolver: zodResolver(fanMemberSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      whyJoin: "",
    }
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
    }
  };

  const onSubmit = async (data: FanMemberFormData) => {
    try {
      let photoBase64: string | undefined = undefined;
      if (data.photo instanceof File) {
        photoBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(data.photo);
        });
      }
      const payload = {
        ...data,
        photo: photoBase64,
      };
      await applicationsAPI.submitFan(payload);
      toast({
        title: "Application Submitted!",
        description: "Your fan membership application has been received. We'll contact you soon!",
      });
      setIsOpen(false);
      form.reset();
      setPhotoFile(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg" variant="secondary" className="h-14 text-lg font-semibold flex items-center gap-2">
          <Users className="w-5 h-5" />
          Join as Fan Member
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xs sm:max-w-md max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">Fan Membership Form</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} className="text-sm" />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter your email" {...field} className="text-sm" />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your phone number" {...field} className="text-sm" />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="whyJoin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Why You Want to Join</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell us why you want to join the Baby Eagle family..."
                      className="min-h-[60px] sm:min-h-[80px] text-sm"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <Label className="text-sm">Passport Size Photo</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-3 sm:p-4 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                  id="fan-photo-upload"
                />
                <label
                  htmlFor="fan-photo-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
                  <span className="text-xs sm:text-sm text-muted-foreground text-center">
                    {photoFile ? photoFile.name : "Click to upload passport photo"}
                  </span>
                </label>
              </div>
            </div>

            <Button type="submit" className="w-full text-sm">
              Join Baby Eagle Family
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default FanMemberForm;