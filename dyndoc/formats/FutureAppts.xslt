<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema" 
    xmlns:fn="http://www.w3.org/2005/xpath-functions" 
    xmlns:xr-date-formatter="java:com.cerner.xsl.util.XSLTDateUtilities" 
    xmlns:n="urn:com-cerner-patient-ehr:v3" 
    xmlns:cdocfx="urn:com-cerner-physician-documentation-functions" 
    xmlns:doc="java:com.cerner.documentation.extension.XSLTFuncs"
    xmlns:dd="DynamicDocumentation" 
    exclude-result-prefixes="xsl xs fn n doc cdocfx xr-date-formatter">
    
    <!-- Comment out this line to debug --> <xsl:import href="/cernerbasiccontent/formats/addressfxn.xslt"/>
    <!-- Uncomment this line to debug> <xsl:import href="AddressFxn.xslt"/> -->
    <!-- Required to include CommonFxn.xslt -->
    <!-- Comment out this line to debug --> <xsl:import href="/cernerbasiccontent/formats/commonfxn.xslt"/>
    <!-- Uncomment this line to debug> <xsl:import href="CommonFxn.xslt"/> -->
    
    
    <xsl:output method="html" encoding="UTF-8" indent="yes"/>
    <xsl:param as="xs:string" name="current-locale" select="'en_US'"/>

    <!-- This will be over-written during Run-Time -->
    <xsl:variable name="bIsUTCOn" as="xs:boolean" select="true()"/>

    <xsl:variable name="DATE_SEQUENCE_UTC_ON_WITH_TIME" as="xs:string" select="'MM/dd/yyyy hh:mm a zzz'"/>

    <xsl:variable name="DATE_SEQUENCE_UTC_OFF_WITH_TIME" as="xs:string" select="'MM/dd/yyyy hh:mm a'"/>

    <xsl:variable name="DATE_ONLY_SEQUENCE" as="xs:string" select="'MM/dd/yyyy'"/>


    <!-- Default string constants -->
    <xsl:variable name="Type">
        <xsl:value-of select="'Appointment Type'"/>
    </xsl:variable>

    <xsl:variable name="When" as="xs:string">
        <xsl:value-of select="'When'"/>
    </xsl:variable>
    
    <xsl:variable name="With" as="xs:string">
        <xsl:value-of select="'With'"/>
    </xsl:variable>

    <xsl:variable name="Where" as="xs:string">
        <xsl:value-of select="'Where'"/>
    </xsl:variable>

    <xsl:variable name="Contact" as="xs:string">
        <xsl:value-of select="'Contact Information'"/>
    </xsl:variable>

    <xsl:variable name="ShowWithCol" as="xs:boolean">
        <xsl:choose>
            <xsl:when test="n:report/n:clinical-data/n:future-appointment-data/n:appointment/@appointment-personnel-id != 0">
                <xsl:value-of select="true()"/>
            </xsl:when>
            <xsl:otherwise>
                <xsl:value-of select="false()"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:variable>
	
    <!--This template is used to check whether a valid future appointments are present and based on this tables header is decided to display -->
    <!-- Parameters -->
    <!-- node Future-appointment-data -->
    <xsl:template name="isThereAnyFutureAppointment" as="xs:boolean">
        <xsl:param name="FutureApptData" as="element()?"/>
       
        <xsl:variable name="futureApptInd">       
                <xsl:for-each select="$FutureApptData/n:appointment">
                    <xsl:if test="doc:getTimeInMillisecs(n:appointment-begin-dt-tm) &gt; doc:getTimeInMillisecs(xs:string(current-dateTime()))">
                        <xsl:value-of select="1"/>
                    </xsl:if>
                </xsl:for-each>      
            <xsl:value-of select="0"/>
        </xsl:variable>
            
        <xsl:choose>
            <xsl:when test="$futureApptInd = 0">
                <xsl:value-of select="false()"/>
            </xsl:when>
            <xsl:otherwise>
                <xsl:value-of select="true()"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
    
    <xsl:template match="/">
        <xsl:variable name="bAnyFutureAppts">
            <xsl:call-template name="isThereAnyFutureAppointment">
                <xsl:with-param name="FutureApptData" select="n:report/n:clinical-data/n:future-appointment-data"/>
            </xsl:call-template>
        </xsl:variable>
		
        <xsl:choose>
            <!-- When there is a scheduled appointment documented.  -->
            <xsl:when test="count(n:report/n:clinical-data/n:future-appointment-data/n:appointment) &gt; 0  and $bAnyFutureAppts != false()">

                <table style="border:1px solid #000; border-collapse:collapse; border-spacing:0;" dd:btnfloatingstyle="top-right" dd:zebrastripecolor="#F4F4F4" dd:zebraheadercolor="#F4F4F4" dd:whitespacecolseparator="true"> <!-- Separate columns by a space in plain text conversion -->
                    <thead style="display:table-header-group;"> <!-- This thead will repeat table heading on each page when printing on paper such as Draft Print -->
                        <tr>
                            <th style="font-weight: bold; text-align:center; border-bottom: 1px solid #000; padding-left:6px;"><xsl:value-of select="$Type"/></th>
                            <th style="font-weight: bold; text-align:center; border-bottom: 1px solid #000; border-left:1px solid #000; padding-left:6px;"><xsl:value-of select="$When"/></th>
                            <xsl:if test="$ShowWithCol">
                                <th style="font-weight: bold; text-align:center; border-bottom: 1px solid #000; border-left:1px solid #000; padding-left:6px;"><xsl:value-of select="$With"/></th>
                            </xsl:if>
                            <th style="font-weight: bold; text-align:center; border-bottom: 1px solid #000; border-left:1px solid #000; padding-left:6px;"><xsl:value-of select="$Where"/></th>
                            <th style="font-weight: bold; text-align:center; border-bottom: 1px solid #000; border-left:1px solid #000; padding-left:6px;"><xsl:value-of select="$Contact"/></th>
                        </tr>
                    </thead>
                    <tbody>
                        <xsl:for-each select="n:report/n:clinical-data/n:future-appointment-data/n:appointment">
                            <!-- sort by date time of appointment -->
                            <xsl:sort select="n:appointment-begin-dt-tm" order="ascending"/>
                               
                            <xsl:variable name="ApptDtTm" as="xs:dateTime" select="n:appointment-begin-dt-tm"/>
							<!--This check is made to display only future appointment i.e., appointment date time should be greater than current date time -->
                            <xsl:if test="doc:getTimeInMillisecs(xs:string($ApptDtTm)) &gt; doc:getTimeInMillisecs(xs:string(current-dateTime()))">
                                <tr class="ddemrcontentitem ddremovable" style="border-top: 1px solid #000" dd:btnfloatingstyle="top-right">
                            	    <xsl:attribute name="dd:entityid" select="@schedule-event-id"/>
                            	    <xsl:attribute name="dd:contenttype" select="'FUTURE_APPTS'"/>
                            	
                                    <td style="vertical-align:top; padding-left:6px;">
                                        <xsl:value-of select="cdocfx:getCodeDisplayByID(@appointment-type-code)"/>
                                    </td>
                                    <td style="vertical-align:top; border-left:1px solid #000; padding-left:6px;">

                                        <!-- This is a derived variable and doesn't need to go in the i18n string tables -->
                                        <xsl:variable name="DATE_SEQUENCE" as="xs:string" select="cdocfx:getDateDisplayPattern($bIsUTCOn, $DATE_SEQUENCE_UTC_ON_WITH_TIME, $DATE_SEQUENCE_UTC_OFF_WITH_TIME)"/>

                                        <xsl:variable name="ApptTimeZone" as="xs:string" select="n:appointment-begin-dt-tm/@time-zone"/>
                                        <xsl:variable name="time" select="substring(xs:string(xs:time($ApptDtTm)), 0, 9)"/>
                                        <xsl:variable name="midnight" select="'00:00:00'"/>

                                        <xsl:choose>
                                            <xsl:when test="$time = $midnight">
                                                <xsl:value-of select="xr-date-formatter:formatDate($ApptDtTm, $DATE_ONLY_SEQUENCE, $ApptTimeZone, $current-locale)"/>
                                            </xsl:when>
                                            <xsl:otherwise>
                                                <xsl:value-of select="xr-date-formatter:formatDate($ApptDtTm, $DATE_SEQUENCE, $ApptTimeZone, $current-locale)"/>
                                            </xsl:otherwise>
                                        </xsl:choose>
                                    </td>

                                    <xsl:if test="$ShowWithCol">
                                        <xsl:choose>
                                            <xsl:when test="@appointment-personnel-id">
                                                <td style="vertical-align:top; border-left:1px solid #000; padding-left:6px;">
                                                    <xsl:value-of select="cdocfx:getProviderNameFullByID(@appointment-personnel-id)"/>
                                                </td>
                                            </xsl:when>
                                            <xsl:otherwise>
                                                <td style="vertical-align:top; border-left:1px solid #000; padding-left:6px;"/>
                                            </xsl:otherwise>
                                        </xsl:choose>
                                    </xsl:if>

                                    <xsl:choose>
                                        <xsl:when test="@appointment-location-code">
                                            <xsl:variable name="location" select="cdocfx:getLocationById(@appointment-location-code)"/>
                                        
                                            <td style="vertical-align:top; border-left:1px solid #000; padding-left:6px;">
                                                <xsl:if test="$location/@description">
                                                    <xsl:value-of select="$location/@description"/>
                                                    <br />
                                                </xsl:if>
                                                <xsl:if test="$location/n:business-address">
                                                    <xsl:call-template name="DisplayAddress">
                                                        <xsl:with-param name="address" select="$location/n:business-address"/>
                                                    </xsl:call-template>
                                                </xsl:if>
                                            </td>
                                            <td style="vertical-align:top; border-left:1px solid #000; padding-left:6px;">
                                                <xsl:value-of select="$location/@business-phone"/>
                                            </td>
                                        </xsl:when>
                                        <xsl:otherwise>
                                            <td style="vertical-align:top; border-left:1px solid #000; padding-left:6px;"/>
                                            <td style="vertical-align:top; border-left:1px solid #000; padding-left:6px;"/>
                                        </xsl:otherwise>
                                    </xsl:choose>
                                </tr>
                            </xsl:if>
                        </xsl:for-each>
                    </tbody>
                </table>
            </xsl:when>
            <xsl:otherwise>
                <!-- Display Nothing -->
                <xsl:value-of select="''"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
</xsl:stylesheet>