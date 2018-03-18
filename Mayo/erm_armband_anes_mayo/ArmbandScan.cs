using System;
using System.Globalization;
using System.Reflection;
using Mayo.ChartPlus.Common.DataAccess;
using Mayo.ChartPlus.Common.Helpers;

namespace Mayo.ChartPlus.Common
{
    public static class ArmbandScan
    {
        private const string CheckDigits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. $/+%";

        public static string AddMayoScanRecord(string clinicNumber, decimal environmentLocationDboid, decimal staffDboid)
        {
            return DatabaseData.AddMayoScanRecord(clinicNumber, environmentLocationDboid, staffDboid);
        }

        public static int AddMayoScanBypassStaff(decimal scanId, decimal staffDboidOne, decimal staffDboidTwo)
        {
            try
            {
                int rows = DatabaseData.AddMayoScanBypassStaff(scanId, staffDboidOne, staffDboidTwo);
                if (rows <= 0)
                {
                    throw new Exception("Error Inserting Scan Bypass Staff Data");
                }
                return rows;
            }
            catch (Exception ex)
            {
                EventLogger.Instance.LogGeneralException(ex, MethodBase.GetCurrentMethod().Name);
            }

            return 0;
        }

        public static int UpdateMayoScanRecord(decimal scanId, decimal environmentLocationDboid)
        {
            try
            {
                int rows = DatabaseData.UpdateMayoScanRecord(scanId, environmentLocationDboid);
                if (rows <= 0)
                {
                    throw new Exception("Error Updating Scan Record");
                }
                return rows;
            }
            catch (Exception ex)
            {
                EventLogger.Instance.LogGeneralException(ex, MethodBase.GetCurrentMethod().Name);
            }

            return 0;
        }

        public static int AddMayoScanData(decimal scanId, decimal scanTypeId, string scanData)
        {
            try
            {
                int rows = DatabaseData.AddMayoScanData(scanId, scanTypeId, scanData);
                if (rows <= 0)
                {
                    throw new Exception("Error Inserting Scan Record");
                }
                return rows;
            }
            catch (Exception ex)
            {
                EventLogger.Instance.LogGeneralException(ex, MethodBase.GetCurrentMethod().Name);
            }

            return 0;
        }

        public static int AddMayoScanBypassData(decimal scanId, decimal scanBypassTypeId, string scanBypassFreeText)
        {
            try
            {
                int rows = DatabaseData.AddMayoScanBypassData(scanId, scanBypassTypeId, scanBypassFreeText);
                if (rows <= 0)
                {
                    throw new Exception("Error Inserting Scan Data");
                }
                return rows;
            }
            catch (Exception ex)
            {
                EventLogger.Instance.LogGeneralException(ex, MethodBase.GetCurrentMethod().Name);
            }

            return 0;   
        }

        public static bool VerifyCheckDigit(string controlString)
        {
            try
            {
                controlString = controlString.ToUpper();

                if (controlString.StartsWith("AC"))
                {
                    string actualCheckDigit = controlString.Substring(controlString.Length - 1);
                    string calculatedCheckDigit = GenerateCheckDigit(controlString.Substring(0, controlString.Length - 1));
                    return actualCheckDigit == calculatedCheckDigit;
                }

                throw new Exception("Invalid Armband Scan");
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static string GenerateCheckDigit(string clinicNumber)
        {
            int sum = 0;
            clinicNumber = clinicNumber.ToUpper();
            int maxCheckDigitIndex = CheckDigits.Length - 1;

            if (!clinicNumber.StartsWith("AC"))
            {
                clinicNumber = "AC" + clinicNumber;
            }

            for (int digitCounter = 0; digitCounter < clinicNumber.Length; digitCounter++)
            {
                for (int characterCounter = 0; characterCounter < maxCheckDigitIndex; characterCounter++)
                {
                    if (CalculateCheckDigit(characterCounter) == clinicNumber[digitCounter].ToString(CultureInfo.InvariantCulture))
                    {
                        sum += (((clinicNumber.Length) - digitCounter) * characterCounter);
                    }
                }
            }

            int modulus = sum % CheckDigits.Length;
            return modulus > maxCheckDigitIndex ? "^" : CalculateCheckDigit(modulus);
        }

        private static string CalculateCheckDigit(int number)
        {
            return CheckDigits.Length > number ? CheckDigits[number].ToString(CultureInfo.InvariantCulture) : "";
        }
    }
}