import { z } from "zod";
import { QueryKey } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { IMAGE_MIME_TYPES, MAX_FILE_SIZE } from "@/constants";
import queryClient from "@/config/queryClient";
import { DeviceTypeEnum, ItemStatusEnum } from "@/types/enum";

export const isObjectEmpty = (obj: unknown): boolean => {
  return (
    !obj || (typeof obj === "object" && Object.keys(obj || {}).length === 0)
  );
};

export const isArrayEmpty = (arr: unknown): boolean => {
  return !arr || (Array.isArray(arr) && arr.length === 0);
};

// INFO:- utils to check if key is valid in the object
export const isValidKey = (key: string, obj: object): key is keyof typeof obj =>
  key in obj;

// INFO:- Format a given size in bytes to a human-readable format like KB and MB.
export const formatSize = (size: number): string => {
  if (size < 1024) return `${size} bytes`;
  if (size < 1048576) return `${(size / 1024).toFixed(2)} KB`;

  return `${(size / 1048576).toFixed(2)} MB`;
};

export const formatNumberToRupees = (amount: string | number): string => {
  const num = Number(amount);

  if (Number.isNaN(num)) return "₹0";

  const formattedNum = num.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });

  return `₹${formattedNum}`;
};

export const sleep = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

// INFO:- use cases
// INFO: concatStrings('hello', 'world') // 'hello world'
// INFO: concatStrings('hello', '', 'world') // 'hello world'
// INFO: concatStrings('hello', null, 'world') // 'hello world'
// INFO: concatStrings('hello', undefined, 'world') // 'hello world'
// INFO: concatStrings('hello', ' ', 'world') // 'hello world'
export const concatStrings = (...strings: string[]): string => {
  return strings
    .filter(Boolean)
    .map((str) => `${str}`.trim())
    .join(" ")
    .trim();
};

//INFO: Helper type guard to check if a value is a File
const isFile = (val: unknown): val is File =>
  typeof File !== "undefined" && val instanceof File;

//INFO: Generic file validator

export const fileValidator = z
  .custom<File>(isFile, { message: "Please upload a valid file" })
  .refine((file) => file.size <= MAX_FILE_SIZE, {
    message: "File size must be under 1MB",
  });
/*
INFO: Will add it in future
export const imageFileValidator = z.union([
	fileValidator.refine(file => IMAGE_MIME_TYPES.includes(file.type), {
		message: 'Only JPG, PNG, or JPEG files are allowed'
	})
	// z.null(),
	// z.undefined()
])
*/
export const imageFileValidator = fileValidator.refine(
  (file) => IMAGE_MIME_TYPES.includes(file.type),
  {
    message: "Only JPG, PNG, or JPEG files are allowed",
  },
);

export const invalidateQueries = (queryKey: QueryKey): Promise<void> => {
  return queryClient.invalidateQueries({ queryKey });
};

//INFO: Search
const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
// INFO: const debouncedSearchTerm = useDebounce(searchText, 500)

//INFO:  IN Future need it
export const buildQueryString = <
  T extends Record<string, string | number | boolean | undefined | null>,
>(
  params: T,
): string => {
  const searchParams = Object.entries(params).reduce((sp, [key, value]) => {
    if (value != null && value !== "") {
      sp.append(key, String(value));
    }

    return sp;
  }, new URLSearchParams());

  return searchParams.toString();
};

export const getStatusColorClass = (status: ItemStatusEnum): string => {
  switch (status) {
    case ItemStatusEnum.COMPLETED:
      return "bg-lightGreen1 text-green";

    case ItemStatusEnum.CANCELLED:
      return "bg-lightRed text-red";

    case ItemStatusEnum.PENDING:
      return "bg-veryLightGray text-themeColor";

    case ItemStatusEnum.CONFIRMED:
      return "bg-themeColor text-white";

    case ItemStatusEnum.ARRIVED:
      return "bg-lightGreen text-green";

    case ItemStatusEnum.ONGOING:
      return "bg-lightRed text-yellow";

    case ItemStatusEnum.ON_HOLD:
      return "bg-lightGray text-white";

    default:
      return "bg-lightGray text-slateGray";
  }
};

export const formatLabel = (s: ItemStatusEnum | "") => {
  if (s === "") return "All";

  return s
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase());
};

export const getDeviceType = (): DeviceTypeEnum => {
  const ua = navigator.userAgent;

  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return DeviceTypeEnum.TABLET;
  }
  if (
    /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
      ua,
    )
  ) {
    return DeviceTypeEnum.MOBILE;
  }

  return DeviceTypeEnum.DESKTOP;
};

export const getDeviceOs = (): string => {
  const platform = navigator.userAgent.toLowerCase();

  if (platform.includes("win")) return "Windows";
  if (platform.includes("mac")) return "macOS";
  if (platform.includes("linux")) return "Linux";
  if (
    platform.includes("iphone") ||
    platform.includes("ipad") ||
    platform.includes("ipod")
  )
    return "iOS";

  const ua = navigator.userAgent.toLowerCase();

  if (ua.includes("android")) return "Android";

  return "Unknown";
};

export const getDeviceId = (): string => {
  let deviceId = sessionStorage.getItem("deviceId");

  if (!deviceId) {
    const timestamp = Date.now().toString(36);
    const randomNum = Math.random().toString(36).substring(2, 15);
    const navigatorInfo = (
      navigator.userAgent +
      navigator.language +
      screen.width +
      screen.height
    )
      .split("")
      .reduce((acc, char) => acc + (char.codePointAt(0) ?? 0), 0)

      .toString(36);

    deviceId = `${timestamp}-${randomNum}-${navigatorInfo}`;

    sessionStorage.setItem("deviceId", deviceId);
  }

  return deviceId;
};

export const canItemBeHeld = (
  status: ItemStatusEnum | undefined | null,
): boolean => {
  if (!status) return false;

  return (
    status !== ItemStatusEnum.CONFIRMED &&
    status !== ItemStatusEnum.COMPLETED &&
    status !== ItemStatusEnum.CANCELLED &&
    status !== ItemStatusEnum.ON_HOLD
  );
};

export const getNextStatusLabel = (nextStatus?: ItemStatusEnum) => {
  switch (nextStatus) {
    case ItemStatusEnum.ARRIVED:
      return "Mark as Arrived";
    case ItemStatusEnum.ONGOING:
      return "Mark as OnGoing";
    case ItemStatusEnum.COMPLETED:
      return "Mark as Completed";
    default:
      return "No Action Available";
  }
};
