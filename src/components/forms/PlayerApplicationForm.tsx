import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const playerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  age: z.preprocess(
    (val) => (val ? Number(val) : undefined),
    z.number().min(10, "Players must be at least 10 years old")
  ),
  contact: z
    .string()
    .regex(/^\d{8,15}$/, "Contact number must be 8–15 digits"),
  email: z.string().email("Please enter a valid email"),
  schoolCommunity: z.string().min(2, "School/Community is required"),
  position: z.string().min(1, "Please select a position"),
  photo: z
    .any()
    .refine(
      (file) =>
        !file ||
        (file instanceof File && file.type.startsWith("image/") && file.size <= 2 * 1024 * 1024),
      {
        message: "Only image files under 2MB are allowed",
      }
    )
    .optional(),
});

type PlayerFormData = z.infer<typeof playerSchema>;

const PlayerApplicationForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<PlayerFormData>({
    resolver: zodResolver(playerSchema),
    defaultValues: {
      fullName: "",
      age: undefined,
      contact: "",
      email: "",
      schoolCommunity: "",
      position: "",
      photo: undefined,
    },
  });

  const onSubmit = async (data: PlayerFormData) => {
    try {
      console.log("Player application data:", data);

      toast({
        title: "Application Submitted!",
        description: "Your player application has been received. We'll contact you soon!",
      });

      setIsOpen(false);
      form.reset();
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
          <UserPlus className="w-5 h-5" />
          Join as Player
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Player Application Form</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name & Age */}
            <div className="flex flex-col sm:flex-row gap-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem className="sm:w-24">
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Age" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Contact & Email */}
            <div className="flex flex-col sm:flex-row gap-4">
              <FormField
                control={form.control}
                name="contact"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Contact Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* School/Community */}
            <FormField
              control={form.control}
              name="schoolCommunity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School/Community</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your school or community" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Position */}
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Football Position</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your preferred position" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="goalkeeper">Goalkeeper</SelectItem>
                      <SelectItem value="defender">Defender</SelectItem>
                      <SelectItem value="midfielder">Midfielder</SelectItem>
                      <SelectItem value="forward">Forward</SelectItem>
                      <SelectItem value="winger">Winger</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Photo Upload */}
            <FormField
              control={form.control}
              name="photo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Passport Size Photo</FormLabel>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="photo-upload"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        field.onChange(file);
                      }}
                    />
                    <label
                      htmlFor="photo-upload"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <Upload className="w-8 h-8 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {field.value ? (field.value as File).name : "Click to upload passport photo"}
                      </span>
                    </label>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit */}
            <Button type="submit" className="w-full">
              Submit Application
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerApplicationForm;
