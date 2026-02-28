/**
 * AppwriteImage
 *
 * expo-image makes plain HTTP requests and cannot carry the Appwrite session
 * cookie. This component gets a short-lived JWT from the current session and
 * appends it as a query param so Appwrite authorises the request.
 *
 * The JWT is regenerated every time the `uri` prop changes or the component
 * mounts, keeping it fresh (Appwrite JWTs live for 15 minutes).
 */

import { appwrite } from "@/src/services/appwrite/client";
import { Image, ImageProps } from "expo-image";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

type Props = Omit<ImageProps, "source"> & {
  uri: string | null | undefined;
  fallback?: React.ReactNode;
};

export function AppwriteImage({ uri, fallback, style, ...props }: Props) {
  const [jwt, setJwt] = useState<string | null>(null);
  const [jwtFailed, setJwtFailed] = useState(false);

  useEffect(() => {
    if (!uri) return;
    let cancelled = false;
    setJwt(null);
    setJwtFailed(false);

    appwrite.account
      .createJWT()
      .then((res) => {
        if (!cancelled) setJwt(res.jwt);
      })
      .catch(() => {
        if (!cancelled) setJwtFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [uri]);

  if (!uri) return fallback ? <>{fallback}</> : null;

  // Show spinner until JWT resolves (or fails)
  if (!jwt && !jwtFailed) {
    return (
      <View
        style={[
          { justifyContent: "center", alignItems: "center" },
          style as any,
        ]}
      >
        <ActivityIndicator size="small" />
      </View>
    );
  }

  return (
    <Image
      source={{
        uri,
        ...(jwt ? { headers: { "x-appwrite-jwt": jwt } } : {}),
      }}
      cachePolicy="none"
      style={style}
      {...props}
    />
  );
}
