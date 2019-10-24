<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="1.0"?>
<xsl:stylesheet version="2.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:xs="http://www.w3.org/2001/XMLSchema"
                xmlns:fn="http://www.w3.org/2005/xpath-functions"
                exclude-result-prefixes="xsl xs fn">

    <!-- This template should be used to display an address in the following format:
                address1
                address2
                address3
                address4
                City-State
                Zip

         The parameter address should have the following attributes:
                address1, city, state, zip.
    -->
    <!-- This is the i18n version of followup address since different locales can have different address formats. This template overrides the one defined in addressfxn.xslt -->
    <xsl:template name="DisplayAddress">
        <xsl:param name = "address"/>
        <xsl:variable name="Address1" as="xs:string">
            <xsl:choose>
                <xsl:when test="$address/@address1">
                    <xsl:value-of select="$address/@address1"/>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:value-of select="''"/>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:variable>

        <xsl:variable name="Address2" as="xs:string">
            <xsl:choose>
                <xsl:when test="$address/@address2">
                    <xsl:value-of select="$address/@address2"/>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:value-of select="''"/>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:variable>

        <xsl:variable name="Address3" as="xs:string">
            <xsl:choose>
                <xsl:when test="$address/@address3">
                    <xsl:value-of select="$address/@address3"/>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:value-of select="''"/>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:variable>

        <xsl:variable name="Address4" as="xs:string">
            <xsl:choose>
                <xsl:when test="$address/@address4">
                    <xsl:value-of select="$address/@address4"/>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:value-of select="''"/>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:variable>

        <xsl:variable name="City" as="xs:string">
            <xsl:choose>
                <xsl:when test="$address/@city">
                    <xsl:value-of select="$address/@city"/>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:value-of select="''"/>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        <xsl:variable name="State" as="xs:string">
            <xsl:choose>
                <xsl:when test="$address/@state">
                    <xsl:value-of select="$address/@state"/>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:value-of select="''"/>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:variable>

        <xsl:variable name="Zip" as="xs:string">
            <xsl:choose>
                <xsl:when test="$address/@zip">
                    <xsl:value-of select="$address/@zip"/>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:value-of select="''"/>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:variable>

        <xsl:if test="$Address1!=''">
            <xsl:value-of select="$Address1"/>
        </xsl:if>

        <xsl:if test="$Address2!=''">
            <xsl:if test="$Address1!=''">
                <br />
            </xsl:if>
            <xsl:value-of select="$Address2"/>
        </xsl:if>

        <xsl:if test="$Address3!=''">
            <xsl:if test="$Address1!='' or $Address2!=''">
                <br />
            </xsl:if>
            <xsl:value-of select="$Address3"/>
        </xsl:if>

        <xsl:if test="$Address4!=''">
            <xsl:if test="$Address1!='' or $Address2!='' or $Address3!=''">
                <br />
            </xsl:if>
            <xsl:value-of select="$Address4"/>
        </xsl:if>

        <xsl:if test="$City!='' or $State!='' or $Zip!=''">
            <br />

            <xsl:if test="$City!=''">
                <xsl:value-of select="$City"/>
            </xsl:if>
            <xsl:if test="$State!=''">
                <xsl:value-of select="'-'"/>
                <xsl:value-of select="$State"/>
            </xsl:if>
            <xsl:if test="$Zip!=''">
                <xsl:if test="$City!='' or $State!=''">
                    <br />
                </xsl:if>
                <xsl:value-of select="$Zip"/>
            </xsl:if>

        </xsl:if>
    </xsl:template>
</xsl:stylesheet>