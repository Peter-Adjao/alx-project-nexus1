import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { 
  ArrowLeft, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Upload,
  Facebook,
  Linkedin,
  Apple,
  Chrome
} from "lucide-react";
import { toast } from "sonner";

interface AuthPagesProps {
  currentAuth: "signin" | "signup" | "profile" | null;
  onClose: () => void;
  onAuthSuccess: (user: any) => void;
}

export function AuthPages({ currentAuth, onClose, onAuthSuccess }: AuthPagesProps) {
  const [signInData, setSignInData] = useState({ email: "", password: "" });
  const [signUpData, setSignUpData] = useState({ 
    firstName: "", 
    lastName: "", 
    email: "", 
    phone: "", 
    password: "", 
    confirmPassword: "" 
  });
  const [profileData, setProfileData] = useState({
    firstName: "Avril",
    lastName: "Jane", 
    email: "narh.kofi@example.com",
    phone: "+(233) 123-4567",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face"
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    // Simulate social login
    setTimeout(() => {
      setIsLoading(false);
      toast.success(`Signed in with ${provider} successfully!`);
      onAuthSuccess({ 
        name: "Social User", 
        email: `user@${provider.toLowerCase()}.com`,
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face"
      });
      onClose();
    }, 1500);
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInData.email || !signInData.password) {
      toast.error("Please fill in all fields");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Signed in successfully!");
      onAuthSuccess({ 
        name: "Narh Kofi", 
        email: signInData.email,
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face"
      });
      onClose();
    }, 1500);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpData.firstName || !signUpData.lastName || !signUpData.email || !signUpData.password) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (signUpData.password !== signUpData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Account created successfully!");
      onAuthSuccess({ 
        name: `${signUpData.firstName} ${signUpData.lastName}`, 
        email: signUpData.email,
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face"
      });
      onClose();
    }, 1500);
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Profile updated successfully!");
      onAuthSuccess({ 
        name: `${profileData.firstName} ${profileData.lastName}`, 
        email: profileData.email,
        avatar: profileData.avatar
      });
    }, 1000);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData({ ...profileData, avatar: e.target?.result as string });
        toast.success("Avatar uploaded successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  if (!currentAuth) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClose} className="w-8 h-8 p-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-xl">
              {currentAuth === "signin" && "Sign In"}
              {currentAuth === "signup" && "Create Account"}
              {currentAuth === "profile" && "Profile Settings"}
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {currentAuth === "signin" && (
            <>
              {/* Social Login Buttons */}
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-3"
                  onClick={() => handleSocialLogin("Google")}
                  disabled={isLoading}
                >
                  <Chrome className="h-4 w-4" />
                  Continue with Google
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-3"
                  onClick={() => handleSocialLogin("Apple")}
                  disabled={isLoading}
                >
                  <Apple className="h-4 w-4" />
                  Continue with Apple
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-3"
                  onClick={() => handleSocialLogin("Facebook")}
                  disabled={isLoading}
                >
                  <Facebook className="h-4 w-4" />
                  Continue with Facebook
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-3"
                  onClick={() => handleSocialLogin("LinkedIn")}
                  disabled={isLoading}
                >
                  <Linkedin className="h-4 w-4" />
                  Continue with LinkedIn
                </Button>
              </div>

              <Separator />

              {/* Email/Password Form */}
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="Email address"
                      value={signInData.email}
                      onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="password"
                      placeholder="Password"
                      value={signInData.password}
                      onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </>
          )}

          {currentAuth === "signup" && (
            <>
              {/* Social Signup Buttons */}
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-3"
                  onClick={() => handleSocialLogin("Google")}
                  disabled={isLoading}
                >
                  <Chrome className="h-4 w-4" />
                  Sign up with Google
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-3"
                  onClick={() => handleSocialLogin("Apple")}
                  disabled={isLoading}
                >
                  <Apple className="h-4 w-4" />
                  Sign up with Apple
                </Button>
              </div>

              <Separator />

              {/* Registration Form */}
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="First name"
                      value={signUpData.firstName}
                      onChange={(e) => setSignUpData({ ...signUpData, firstName: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                  <Input
                    placeholder="Last name"
                    value={signUpData.lastName}
                    onChange={(e) => setSignUpData({ ...signUpData, lastName: e.target.value })}
                    required
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={signUpData.email}
                    onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="tel"
                    placeholder="Phone number (optional)"
                    value={signUpData.phone}
                    onChange={(e) => setSignUpData({ ...signUpData, phone: e.target.value })}
                    className="pl-10"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={signUpData.password}
                    onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="Confirm password"
                    value={signUpData.confirmPassword}
                    onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </>
          )}

          {currentAuth === "profile" && (
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              {/* Avatar Upload */}
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profileData.avatar} />
                  <AvatarFallback>{profileData.firstName[0]}{profileData.lastName[0]}</AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-2">
                  <label htmlFor="avatar-upload" className="cursor-pointer">
                    <Button variant="outline" size="sm" className="gap-2" type="button">
                      <Upload className="h-4 w-4" />
                      Upload Photo
                    </Button>
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Profile Form */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">First Name</label>
                    <Input
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Last Name</label>
                    <Input
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Phone</label>
                  <Input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1 bg-teal-500 hover:bg-teal-600" disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update Profile"}
                </Button>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}